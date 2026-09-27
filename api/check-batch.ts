import { probeYouTubeHandle } from './check-handle';

export default async function handler(
  req: {
    method?: string;
    body?: { handles?: unknown };
  },
  res: {
    status: (code: number) => { json: (data: unknown) => void };
  },
) {
  if (req.method && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const handles = req.body?.handles;
  if (!Array.isArray(handles)) {
    return res.status(400).json({ error: 'Lista de handles inválida.' });
  }

  const validHandles = handles
    .map((h) => String(h || '').replace(/^@/, '').trim().toLowerCase())
    .filter((h) => /^[a-z0-9._-]{2,30}$/.test(h))
    .slice(0, 15);

  const results = await Promise.all(validHandles.map((h) => probeYouTubeHandle(h)));
  return res.status(200).json({ results });
}
