# Quandrify deployment

Listings cost $10 USD. Every new listing payment and subsequent $10 promotion upgrade adds the actual amount paid after discounts to cumulative promotional credit. Top 10 ranks published products by highest credit, then by the earliest time that total was reached. There is no expiry, duration, calendar reset or guaranteed position. Higher-paying products displace lower-paying products; traffic, leads and sales are not guaranteed.

## Update your existing Vercel deployment

1. Replace the repository files with this release, including `src`, `prisma/schema.prisma`, **both** migration folders, scripts and tests. Keep existing environment variables private. Do not upload `.env`, `node_modules` or `.next`.
2. Keep Vercel's build command as `npm run db:migrate && npm run build`. Use Node 22. Commit the update and deploy; the new migration adds coupon/ad tables and promotional payment fields to the existing PostgreSQL database.
3. Open `/codersmansion/admin/promotions` (or click **Coupons & Ads**) using your existing admin login. Create percentage or fixed-USD coupons and enable/disable them. An optional coupon expiry does not change permanent ranking rules. Coupon codes are unique and case-insensitive; coupon discounts retain a minimum $1 payment. Coupons are reusable while active.
4. In the same panel, create sponsored ads with a title, description, destination link and optional public image URL. The newest enabled ad shows after the visitor has scrolled at least 700 pixels on the homepage, once per browser session, labeled Sponsored. Visitors can close it or press Escape. Disable the ad to stop future displays.
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

Admin sessions expire after one day. Re-running admin:create rotates the password and revokes sessions. Seller URLs are bearer credentials: keep them private. Public listings remove seller tokens, contact details and metrics not marked public. Checkout saves the seller URL in browser session storage; payment success exposes a bookmarkable management link. Seller links are queued and emailed after publication when Resend is configured. Failed sends can be retried from the admin listing editor. Lost links require an operator to verify ownership before recovery.

If order creation times out, the payment is marked RECONCILIATION_REQUIRED rather than creating a second payable order. An operator must locate the receipt (local payment ID) in Razorpay and reconcile the order ID/status before retrying. Watch INITIALIZING records left by process interruptions, old pending orders, database errors and webhook failures. Preserve provider and database logs with restricted access; do not log credentials or card data.

Full processed refunds synchronize the local payment and remove associated placements; a refunded base listing is archived. Partial processed refunds reduce promotional credit automatically. Chargebacks require manual review in Razorpay and local reconciliation. Refunds are initiated in the Razorpay dashboard, not this site's admin UI. Contact inquiries use Resend; failed deliveries are recorded and return an error. Seller confirmation email status and retries are tracked separately; contact inquiries still have no retry queue.

## Validation and launch status

Security tests cover HMAC verification, salted passwords, input validation and public-field redaction. The PostgreSQL concurrency test must run on an isolated disposable database; it concurrently replays fulfillment, verifies a cumulative upgrade, verifies refund exclusion and confirms no daily spots are created. CI provides a PostgreSQL service and runs migration, type checks, tests, concurrency checks and production build.

This package is a hardened deployment candidate, not a deployed or certified production service. Live Razorpay credentials, merchant approval, real card capture/webhook tests, database concurrency checks, email verification, backup recovery and operational monitoring remain required before launch. Consult VALIDATION.md for checks actually completed in this environment.

## Manually add listings

Admin → Listings → Add Listing opens `/codersmansion/admin/listings/new`. Required profile and seller fields are validated, then published directly without checkout. Leave Premium unchecked for a directory-only listing; check it to grant credit in $10 increments. A $20 customer total outranks a $10 admin grant. Credit is stored separately from payments and never contributes to revenue. Admin grants and subsequent actual payments combine for ranking, with the same tie rule. Creation and granted credit are audited. Save the private seller link returned after publication. Deploy the new `20261011100000_admin_listing_credit` migration before using this feature.

## Automatic listing updates

Publishing through the admin invalidates marketplace paths and signals other open tabs in the same browser. Homepage, search, admin Listings and Top Spots refresh data on navigation, focus and every 15 seconds while visible, without a full page reload. New products may remain excluded by active search/category filters or appear in Top 10 rather than the general feed. No new database migration is needed for this refresh fix.

## Discovery and seller tools release

Deploy all updated source files and the new `20261011130000_discovery_tools` migration. Keep Vercel's build command `npm run db:migrate && npm run build`. Existing listing/payment/ranking data is preserved.

- Homepage: search-first browsing, real category counts, fresh arrivals, compact sponsored Top 10 and load-more discovery. Filtered searches include sponsored products. Saved products work without sign-in and are stored only in the visitor's browser. Archived/unpublished saved products are hidden. Product pages include related products and an issue-report form. Only seller-shared metrics are displayed; previous fictional fallback numbers were removed.
- Logos: public and admin creation forms now accept PNG/JPEG/WebP uploads. The browser resizes to at most 512 pixels and converts to WebP. The server validates the file header and caps the streamed body at 256 KiB. Files are stored in PostgreSQL and served as public, immutable images, so no additional storage credentials are needed. This launch implementation caps uploads at 100 per rolling day and 1,000 total, with a database advisory lock around quota checks. Capacity errors retain the manual logo-URL option. Uploaded assets have no automatic deletion; monitor database size and remove unreferenced assets as needed before expanding capacity. Back up media with the database.
- Seller email: configure `RESEND_API_KEY`, a verified `EMAIL_FROM`, and the correct HTTPS `NEXT_PUBLIC_APP_URL`. A successful initial listing payment or admin-created publication queues the private seller link. Provider acceptance is tracked; network/provider failures leave a retryable record and do not roll back a successful payment. Admin → Listings → click a product's Edit link → Send/retry private seller link. Sender verification, actual delivery and bounce handling must be checked in Resend. No automatic scheduled mail worker is configured: payment/webhook calls retry delivery and admins can retry failures. Old listings are not emailed retroactively until an admin queues them.
- Ranking preview: seller management shows overall rank, current credit and estimated extra credit to move up or enter Top 10. Estimates assume $10 increments before discounts and respect tie priority. They can change during checkout; they do not reserve a position.
- Admin editing: change product information, status or granted Premium credit from the listing editor. Unchecking Premium removes only the admin grant, never actual paid credit. Changing a grant updates its tie timestamp. Credit and status changes are audited. Changing the seller email clears the prior delivery record so an admin can send the current private link to the new address.
- Admin search: filter listings by title/seller email, status or category; results paginate at 50 entries.
- Reports: visitors can report broken links, misleading information or inappropriate content. Admin → Reports shows submitted issues and supports resolution/dismissal. Suspend/archive the listing through its editor when appropriate; submitting a report does not automatically remove a product.
- Sponsored popups: the newest active popup appears only after a visitor scrolls 700 pixels, once per session, with explicit Sponsored labeling and a close button/Escape support. It does not interrupt the initial discovery view.

These changes aim to make browsing more useful. Increased retention is not proven by implementation alone; measure visits, saved-product usage and product exploration after launch.

### Live ticker and rules popup
The top banner shows the six newest published listings and estimates active browsers from visible-tab heartbeats every 30 seconds, with a two-minute activity window. A random HttpOnly cookie deduplicates tabs; this is a browser estimate and may include bots, not verified people. No invented fallback counts are displayed. Hidden tabs stop heartbeats; admin and seller-management routes do not register presence. Deploy the VisitorPresence migration before use.
Rules / How it works opens an accessible native dialog from the header and existing ranking-rule locations. Escape, close buttons and clicks outside dismiss it. The ticker pauses on hover/focus and respects reduced motion.

### Collections, screenshots and share cards
Deploy the 20261012104000_product_discovery migration. Use Admin → Listings → Edit (or Add Listing) to select curated collections and add screenshots. Collections start empty; products are never automatically labelled free. The three launch collections are Free AI tools, Tools for freelancers and Build your first SaaS. Paid rankings are separate. Public and seller-management forms can add up to six screenshot URLs or uploads; only admin routes set collection membership. Uploads reuse existing storage caps (256 KB stored image, 5 MB source, 100/day and 1,000 total); screenshot images are resized to at most 1,280 pixels.
Published product pages include an enlargeable gallery, share/copy buttons and a downloadable 1,200 × 630 PNG card. Open Graph and Twitter metadata use that card. Share cards use public product title, tagline and category, without private metrics or contact details. Native sharing depends on browser support; copy link is available. Collection pages list only published products and paginate in batches of 24.
