# eBay Order Agent — Classic Layout

Design based on the supplied customer-service HTML. The browser fetches `/api/order?par_orderIds=...`, which proxies to Zoho Creator.

Deploy on Vercel with framework **Other** and environment variable `ZOHO_CREATOR_PUBLIC_KEY`.

Unknown JSON fields are shown under expandable Additional fields within each relevant card. Internal notes require a separate Zoho Creator endpoint.

**Security:** Implement authentication and authorization before putting customer records in production.
