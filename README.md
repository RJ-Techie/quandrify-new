# Quandrify deployment

Listings cost $10 USD. Every new listing payment and subsequent $10 promotion upgrade adds the actual amount paid after discounts to cumulative promotional credit. Top 10 ranks published products by highest credit, then by the earliest time that total was reached. There is no expiry, duration, calendar reset or guaranteed position. Higher-paying products displace lower-paying products; traffic, leads and sales are not guaranteed.

## Update your existing Vercel deployment

1. Replace the repository files with this release, including `src`, `prisma/schema.prisma`, **both** migration folders, scripts and tests. Keep existing environment variables private. Do not upload `.env`, `node_modules` or `.next`.
2. Keep Vercel's build command as `npm run db:migrate && npm run build`. Use Node 22. Commit the update and deploy; the new migration adds coupon/ad tables and promotional payment fields to the existing PostgreSQL database.
3. Open `/codersmansion/admin/promotions` (or click **Coupons & Ads**) using your existing admin login. Create percentage or fixed-USD coupons and enable/disable them. An optional coupon expiry does not change permanent ranking rules. Coupon codes are unique and case-insensitive; coupon discounts retain a minimum $1 payment. Coupons are reusable while active.
4. In the same panel, create sponsored ads with a title, description, destination link and optional public image URL. The newest enabled ad shows on the homepage once per browser session, labeled Sponsored. Visitors can close it or press Escape. Disable the ad to stop future displays.
5. Confirm the browser title says Quandrify and the amber Q icon appears. Refresh the browser to clear an old cached tab icon.
6. Test listing field messages, invalid and valid coupons, captured USD payments, duplicate webhook delivery, promotional upgrades, full/partial refunds, admin authorization and popup dismissal on your deployed environment.

### Existing payments

The migration preserves existing listings and payments. Existing paid Top 10 add-ons retain their $99 promotional credit; existing standard-only $49 payments do not acquire promotional credit retrospectively. Old daily allocation tables are preserved for audit but no longer drive display or payment fulfillment. New listing payments contribute their net amount. Full refunds are excluded from ranking; partial refunds reduce credit using the immutable original credit, so repeated webhook delivery does not subtract twice. A full refund of a listing payment archives that listing; a refunded promotional upgrade does not archive it.

## Run locally

Use Node 22 and PostgreSQL 16 or later. Copy `.env.example` to `.env`, set a development database URL and test Razorpay keys. Run `npm ci`, `npm run db:migrate`, `npm run admin:create` with ADMIN_EMAIL and ADMIN_PASSWORD (at least 16 characters) set in your shell, then `npm run dev`. Demo seeding is optional, destructive, and blocked in production. There are no default admin credentials. Existing SHA-256 admin hashes must be replaced with `admin:create`.

## Deploy

1. Provision PostgreSQL with TLS, backups and restore testing. The original archive used SQLite: existing data needs a separately reviewed export/import; this migration initializes a new PostgreSQL database and does not migrate SQLite data.
2. Set DATABASE_URL, NEXT_PUBLIC_APP_URL to your HTTPS origin, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, RESEND_API_KEY, and EMAIL_FROM. Use a verified Resend sender. Secrets are server-only. Production refuses test Razorpay keys; test checkout must run in a staging/development environment.
3. Enable international payments and USD for your Razorpay merchant account. For an India-based account, USD collection generally settles in INR. Configure automatic capture in Razorpay.
4. Run `npm ci`, `npm run db:migrate`, provision the admin, `npm test`, `npm run test:concurrency`, and `npm run build`. Start with `npm start`, or build the included Dockerfile. Run migrations as a separate release job before starting the standalone container.
5. Register `https://YOUR_DOMAIN/api/razorpay/webhook` for payment.captured, order.paid, and refund.processed. Set its secret to RAZORPAY_WEBHOOK_SECRET. Monitor delivery failures and retries. Unauthorized webhooks are rejected; only server-fetched matching captured payments fulfill orders.
6. Configure HTTPS, a trusted reverse proxy, request-size limits (64 KiB), bot protection, and rate limits. Set TRUST_PROXY=true only when your ingress overwrites x-forwarded-for. Otherwise application limits use a shared global bucket. Limit body size at ingress because chunked requests may omit Content-Length.
7. Complete a live USD card purchase, confirm exactly one listing and one promotional credit contribution, replay webhooks, process a refund, and verify seller email delivery before opening checkout to customers. Verify all policies and operator/contact details for your actual business.

## Operations

Admin sessions expire after one day. Re-running admin:create rotates the password and revokes sessions. Seller URLs are bearer credentials: keep them private. Public listings remove seller tokens, contact details and metrics not marked public. Checkout saves the seller URL in browser session storage; payment success exposes a bookmarkable management link. Seller links are not emailed automatically. Lost links require an operator to verify ownership before recovery.

If order creation times out, the payment is marked RECONCILIATION_REQUIRED rather than creating a second payable order. An operator must locate the receipt (local payment ID) in Razorpay and reconcile the order ID/status before retrying. Watch INITIALIZING records left by process interruptions, old pending orders, database errors and webhook failures. Preserve provider and database logs with restricted access; do not log credentials or card data.

Full processed refunds synchronize the local payment and remove associated placements; a refunded base listing is archived. Partial processed refunds reduce promotional credit automatically. Chargebacks require manual review in Razorpay and local reconciliation. Refunds are initiated in the Razorpay dashboard, not this site's admin UI. Contact inquiries use Resend; failed deliveries are recorded and return an error. No email retry queue is included.

## Validation and launch status

Security tests cover HMAC verification, salted passwords, input validation and public-field redaction. The PostgreSQL concurrency test must run on an isolated disposable database; it concurrently replays fulfillment, verifies a cumulative upgrade, verifies refund exclusion and confirms no daily spots are created. CI provides a PostgreSQL service and runs migration, type checks, tests, concurrency checks and production build.

This package is a hardened deployment candidate, not a deployed or certified production service. Live Razorpay credentials, merchant approval, real card capture/webhook tests, database concurrency checks, email verification, backup recovery and operational monitoring remain required before launch. Consult VALIDATION.md for checks actually completed in this environment.
