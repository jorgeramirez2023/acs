// Vercel Node.js serverless function. Zoho Creator is queried server-side,
// so the browser calls a same-origin /api/order endpoint without CORS issues.
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderId = String(req.query.par_orderIds ?? '').trim();
  if (!/^[A-Za-z0-9-]{3,80}$/.test(orderId)) {
    return res.status(400).json({ error: 'Invalid or missing par_orderIds' });
  }

  const key = process.env.ZOHO_CREATOR_PUBLIC_KEY;
  if (!key) {
    return res.status(500).json({ error: 'Missing ZOHO_CREATOR_PUBLIC_KEY in Vercel environment variables' });
  }

  const url = new URL('https://www.zohoapis.com/creator/custom/automobilecomputersolutions/eBay_get_order_ALL_DATA');
  url.searchParams.set('publickey', key);
  url.searchParams.set('par_orderIds', orderId);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(25000)
    });
    const body = await response.text();
    let parsed;
    try { parsed = JSON.parse(body); }
    catch {
      return res.status(502).json({ error: 'Zoho Creator did not return valid JSON', upstreamStatus: response.status });
    }
    if (!response.ok) {
      return res.status(502).json({ error: 'Zoho Creator returned an HTTP error', upstreamStatus: response.status, details: parsed });
    }
    return res.status(200).json(parsed);
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({ error: timedOut ? 'Zoho Creator timed out' : 'Could not contact Zoho Creator' });
  }
}
