import { authenticated, clearSession, setSession, validCredentials } from '../lib/auth.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') return res.status(200).json({ authenticated: authenticated(req) });
  if (req.method === 'DELETE') {
    clearSession(res);
    return res.status(200).json({ authenticated: false });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); }
  catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  const user = String(body?.username || '');
  const pass = String(body?.password || '');
  if (!validCredentials(user, pass)) return res.status(401).json({ error: 'Invalid username or password' });
  try {
    setSession(res);
    return res.status(200).json({ authenticated: true });
  } catch {
    return res.status(500).json({ error: 'Session configuration missing' });
  }
}
