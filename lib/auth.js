import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'ebay_agent_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  // Reuses existing server-side key if a dedicated session secret is not provided.
  return process.env.AUTH_SESSION_SECRET || process.env.ZOHO_CREATOR_PUBLIC_KEY;
}

function sign(value) {
  const key = secret();
  if (!key) throw new Error('Session secret is not configured');
  return createHmac('sha256', key).update(value).digest('base64url');
}

function equal(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function validCredentials(user, pass) {
  return equal(user, process.env.AUTH_USER || 'admin') &&
         equal(pass, process.env.AUTH_PASSWORD || 'admin');
}

export function setSession(res) {
  const expiry = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = String(expiry);
  const session = `${payload}.${sign(payload)}`;
  res.setHeader('Set-Cookie', `${COOKIE}=${session}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`);
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

export function authenticated(req) {
  try {
    const rawCookie = String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`));
    if (!rawCookie) return false;
    const session = rawCookie.slice(COOKIE.length + 1);
    const split = session.indexOf('.');
    if (split < 1) return false;
    const expiry = session.slice(0, split);
    const signature = session.slice(split + 1);
    if (!/^\d+$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return false;
    return equal(signature, sign(expiry));
  } catch { return false; }
}
