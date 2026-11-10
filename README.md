# eBay Customer Service Order Viewer

Order search screen for customer-service agents. HTML/CSS/JavaScript frontend plus a Vercel serverless function that calls the Zoho Creator Custom API.

## Deploy
1. Create a GitHub repository and upload the *contents* of this folder, preserving `api/order.js`.
2. In Vercel, import that repository. Framework Preset: **Other**. Root Directory: `./`.
3. Add environment variable `ZOHO_CREATOR_PUBLIC_KEY` with your Zoho Creator Custom API public key (for Production).
4. Deploy (or redeploy if you added the variable after the first deployment).
5. Open the Vercel URL, enter order `21-15381-49695`, click **Search order**.

## Routes
- `/` - order viewer.
- `/api/order?par_orderIds=21-15381-49695` - same-origin proxy that returns Zoho's original JSON (`{code:3000,result:{...}}`).

## Notes
- No PHP required. Browser never calls Zoho directly, avoiding browser CORS blocks.
- The frontend handles Zoho Creator's `result` wrapper and dynamically shows additional unknown fields.
- This sample proxy exposes data to anyone who can reach the deployed site and knows an order ID. For real customer records, add authentication and access authorization before production. A Zoho `publickey` by itself is not suitable access control.
