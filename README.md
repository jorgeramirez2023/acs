# eBay Order Agent (Vercel)

Single-page service-agent dashboard inspired by the supplied screenshot.

## Deploy
1. Upload the contents of this folder to a GitHub repository.
2. Import the repository in Vercel (Framework: Other).
3. Set `ZOHO_CREATOR_PUBLIC_KEY` in Vercel Environment Variables.
4. Deploy. Enter an eBay order number and click **Search Order**.

The HTML calls `/api/order?par_orderIds=...`, and the serverless function calls the Zoho Creator Custom API. The browser does not directly call Zoho, so CORS is avoided.

## Dynamic fields
Known fields appear in the designed cards. Unknown keys are shown automatically in collapsible "Additional ... fields" blocks, recursively including arrays and nested objects.

## Internal notes
**Not connected.** The **Internal notes** section is reserved for notes from a separate **Zoho Creator form**, not eBay. An additional endpoint and its response schema are needed to wire it up. Likewise, the internal status/comment fields and eBay messaging are not populated by the current order JSON. No records are invented.

## Security
The deployed `/api/order` endpoint currently has no user authentication. Add authentication and authorization before allowing production customer data access. The public key remains a server-side environment variable, but the order lookup itself is still publicly callable until protected.
