# eBay Order Agent – simple login for Vercel

Upload these files to your existing GitHub repository, preserving folders. Vercel will redeploy automatically.

- `index.html`: same customer-service dashboard plus username/password login.
- `api/auth.js`: server-side login/logout/status; 8-hour signed HttpOnly cookie.
- `api/order.js`: calls Zoho Creator, now requires a valid session.
- `lib/auth.js`: session signature and verification.
- `package.json`: ESM configuration.

**Demo credentials:** admin / admin. For real use, add `AUTH_USER` and `AUTH_PASSWORD` in Vercel → Settings → Environment Variables to override them, and add `AUTH_SESSION_SECRET` to a long random secret. Existing `ZOHO_CREATOR_PUBLIC_KEY` remains required. If `AUTH_SESSION_SECRET` is absent, sessions are signed with your existing `ZOHO_CREATOR_PUBLIC_KEY` as a fallback; defining a dedicated secret is strongly recommended.

**Security:** admin/admin is a shared, guessable demo credential, not appropriate for real customer data. This is a simple login with no rate limiting, audit log, or per-user authorization. The HTML file itself is publicly accessible, but actual order data via `/api/order` is protected by the cookie.
