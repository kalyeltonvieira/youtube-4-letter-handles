interface HandleCheckResult {
  handle: string;
  available: boolean;
  httpStatus: number;
  latencyMs: number;
  checkedAt: string;
  youtubeUrl: string;
}

const handleCache = new Map<string, { result: HandleCheckResult; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function probeYouTubeHandle(rawHandle: string): Promise<HandleCheckResult> {
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

export default async function handler(
  req: { query?: Record<string, string | string[] | undefined> },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
    setHeader?: (name: string, value: string) => void;
  },
) {
  const rawQuery = req.query?.handle;
  const handle = String(Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || '').trim();

  if (!handle || !/^[a-zA-Z0-9._-]{2,30}$/.test(handle.replace(/^@/, ''))) {
    return res.status(400).json({ error: 'Handle inválido.' });
  }

  if (res.setHeader) {
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
  }

  const result = await probeYouTubeHandle(handle);
  return res.status(200).json(result);
}
