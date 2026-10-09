# Quandrify deployment

This release replaces all mock Stripe/PayPal payments with Razorpay Standard Checkout in USD. Prices are computed on the server: listing $49, listing with Top 10 $148, upgrade $99. Publication happens only after a matching captured payment. Checkout and signed webhooks share serializable, retryable fulfillment. A paid Top 10 add-on gets the next available UTC day when simultaneous checkouts fill the current day; placement lasts until that day's midnight UTC (not a rolling 24 hours). Prior-day spots no longer roll over.

## Run locally

Use Node 22 and PostgreSQL 16 or later. Copy `.env.example` to `.env`, set a development database URL and test Razorpay keys. Run `npm ci`, `npm run db:migrate`, `npm run admin:create` with ADMIN_EMAIL and ADMIN_PASSWORD (at least 16 characters) set in your shell, then `npm run dev`. Demo seeding is optional, destructive, and blocked in production. There are no default admin credentials. Existing SHA-256 admin hashes must be replaced with `admin:create`.

## Deploy

1. Provision PostgreSQL with TLS, backups and restore testing. The original archive used SQLite: existing data needs a separately reviewed export/import; this migration initializes a new PostgreSQL database and does not migrate SQLite data.
2. Set DATABASE_URL, NEXT_PUBLIC_APP_URL to your HTTPS origin, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET, RESEND_API_KEY, and EMAIL_FROM. Use a verified Resend sender. Secrets are server-only. Production refuses test Razorpay keys; test checkout must run in a staging/development environment.
3. Enable international payments and USD for your Razorpay merchant account. For an India-based account, USD collection generally settles in INR. Configure automatic capture in Razorpay.
4. Run `npm ci`, `npm run db:migrate`, provision the admin, `npm test`, `npm run test:concurrency`, and `npm run build`. Start with `npm start`, or build the included Dockerfile. Run migrations as a separate release job before starting the standalone container.
5. Register `https://YOUR_DOMAIN/api/razorpay/webhook` for payment.captured, order.paid, and refund.processed. Set its secret to RAZORPAY_WEBHOOK_SECRET. Monitor delivery failures and retries. Unauthorized webhooks are rejected; only server-fetched matching captured payments fulfill orders.
6. Configure HTTPS, a trusted reverse proxy, request-size limits (64 KiB), bot protection, and rate limits. Set TRUST_PROXY=true only when your ingress overwrites x-forwarded-for. Otherwise application limits use a shared global bucket. Limit body size at ingress because chunked requests may omit Content-Length.
7. Complete a live USD card purchase, confirm exactly one listing/placement, replay webhooks, process a refund, and verify seller email delivery before opening checkout to customers. Verify all policies and operator/contact details for your actual business.

## Operations

Admin sessions expire after one day. Re-running admin:create rotates the password and revokes sessions. Seller URLs are bearer credentials: keep them private. Public listings remove seller tokens, contact details and metrics not marked public. Checkout saves the seller URL in browser session storage; payment success exposes a bookmarkable management link. Seller links are not emailed automatically. Lost links require an operator to verify ownership before recovery.

If order creation times out, the payment is marked RECONCILIATION_REQUIRED rather than creating a second payable order. An operator must locate the receipt (local payment ID) in Razorpay and reconcile the order ID/status before retrying. Watch INITIALIZING records left by process interruptions, old pending orders, database errors and webhook failures. Preserve provider and database logs with restricted access; do not log credentials or card data.

Full processed refunds synchronize the local payment and remove associated placements; a refunded base listing is archived. Partial refunds and chargebacks require manual review in Razorpay and local reconciliation. Refunds are initiated in the Razorpay dashboard, not this site's admin UI. Contact inquiries use Resend; failed deliveries are recorded and return an error. No email retry queue is included.

## Validation and launch status

Security tests cover HMAC verification, salted passwords, input validation and public-field redaction. The PostgreSQL concurrency test must run on an isolated disposable database; it allocates 20 payments across successive days. CI provides a PostgreSQL service and runs migration, type checks, tests, concurrency checks and production build.

This package is a hardened deployment candidate, not a deployed or certified production service. Live Razorpay credentials, merchant approval, real card capture/webhook tests, database concurrency checks, email verification, backup recovery and operational monitoring remain required before launch. Consult VALIDATION.md for checks actually completed in this environment.
