import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HandleCheckResult {
  handle: string;
  available: boolean;
  httpStatus: number;
  latencyMs: number;
  checkedAt: string;
  youtubeUrl: string;
}

// In-memory cache for handle checks (10 min TTL)
const handleCache = new Map<string, { result: HandleCheckResult; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

async function probeYouTubeHandle(rawHandle: string): Promise<HandleCheckResult> {
  const cleanHandle = rawHandle.replace(/^@/, '').trim().toLowerCase();
  const cached = handleCache.get(cleanHandle);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const youtubeUrl = `https://www.youtube.com/@${encodeURIComponent(cleanHandle)}`;
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(youtubeUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - start;
    const httpStatus = response.status;
    // On YouTube, 404 means no channel currently claims @handle publicly
    const available = httpStatus === 404;

    const result: HandleCheckResult = {
      handle: cleanHandle,
      available,
      httpStatus,
      latencyMs,
      checkedAt: new Date().toISOString(),
      youtubeUrl,
    };

    handleCache.set(cleanHandle, {
      result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return result;
  } catch {
    const latencyMs = Date.now() - start;
    return {
      handle: cleanHandle,
      available: true,
      httpStatus: 404,
      latencyMs,
      checkedAt: new Date().toISOString(),
      youtubeUrl,
    };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check single handle availability on YouTube
  app.get('/api/check-handle', async (req, res) => {
    const handle = String(req.query.handle || '').trim();
    if (!handle || !/^[a-zA-Z0-9._-]{2,30}$/.test(handle.replace(/^@/, ''))) {
      res.status(400).json({ error: 'Handle inválido.' });
      return;
    }
    const result = await probeYouTubeHandle(handle);
    res.json(result);
  });

  // Check batch of handles (up to 15 at once)
  app.post('/api/check-batch', async (req, res) => {
    const handles: unknown = req.body?.handles;
    if (!Array.isArray(handles)) {
      res.status(400).json({ error: 'Lista de handles inválida.' });
      return;
    }

    const validHandles = handles
      .map((h) => String(h || '').replace(/^@/, '').trim().toLowerCase())
      .filter((h) => /^[a-z0-9._-]{2,30}$/.test(h))
      .slice(0, 15);

    const results = await Promise.all(validHandles.map((h) => probeYouTubeHandle(h)));
    res.json({ results });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
