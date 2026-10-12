# Validation performed

- Next.js 15.5.27 production build: passed.
- TypeScript checks: passed.
- Eight automated security/payment/ranking tests: passed, including empty optional URL regression coverage, cumulative ranking, tie ordering, persistent historical payments and discount arithmetic.
- Runtime dependency audit (`npm audit --omit=dev`): zero reported vulnerabilities.
- Full audit: seven development dependency findings (five high, two moderate), concentrated in the Tailwind 3 build toolchain. The available braces version has no published patched 3.x release. A Tailwind 4 migration is still required to clear the build-tool audit; it has not been undertaken here. Build only trusted source/CSS and revisit these dependencies before launch.
- PostgreSQL migration SQL generated and included; migration application and allocation concurrency tests were not run locally because PostgreSQL is unavailable in this execution environment. CI is configured to run them.
- Live Razorpay capture, refund, webhook delivery, SMTP/Resend delivery, deployment and browser checkout have not been exercised without merchant credentials and hosting.

This is a hardened source release with deployment configuration. Production readiness is conditional on completing the operational checks in README.md and addressing the development dependency audit.

## This release: permanent ranking, coupons and sponsored ads

- Added a PostgreSQL migration for coupons, sponsored ads, original/net promotional credit, payment kinds and capture timestamps. Historical paid add-on credit is carried forward.
- TypeScript checks, Prisma client generation and eight tests passed. Final production build and TypeScript checks passed after the seller portal changes.
- Database migration execution, SQL ranking aggregation, concurrent database fulfillment, authenticated admin coupon/ad mutations, live Razorpay checkout/refund webhooks and browser UI behavior require deployed verification. No production database credentials or merchant account were accessed.
- Sponsored ads use native modal dialogs with Escape/close support, explicit Sponsored disclosure and session-scoped frequency control. The public ad endpoint only returns display fields from the latest active ad.
- Admin mutations require an authenticated admin session and a same-origin request. Values and HTTP(S) URLs are validated on the server. Coupon prices are calculated again on the server when the payment is created; a previously quoted amount is fixed for that payment.

## Admin-created listings

Authenticated creation, field validation, Premium grant validation and transactional audit logging are implemented. Promotional grants are separate from paid transactions. Database execution, authenticated browser creation and deployed ranking remain to be verified with a PostgreSQL database.

Admin grant eligibility, dollar validation and displacement/combined credit tests added. Final checks include eleven automated tests.

Admin listing release: Prisma generation, TypeScript, eleven tests and production build passed. Live database/admin browser checks were not run.

Listing refresh fix: TypeScript and a clean production build passed. Refresh triggers, 15-second visible-page polling, cross-tab notification and refreshed admin row synchronization are implemented. Browser behavior on the deployed database has not been exercised.

## Discovery and seller tools release checks

- Prisma client generation and TypeScript checks passed.
- Sixteen tests pass, including rendering cards to verify private metrics are hidden, file header/size checks, report validation, ranking ties/discount estimates and mocked seller-email success/idempotency/failure paths.
- Production build passed after implementing the new routes and components; the final clean build passed after the homepage and accessibility adjustments.
- Browser interaction testing was attempted, but Chromium was unavailable in the runtime. No screenshot, mobile overflow, save persistence or upload-browser pass is claimed. The temporary fixture route was removed from the source package.
- No production database or credentials were accessed. Apply the migration and verify file upload/storage, transactional email queue/lease behavior, admin authorization/editing, report moderation, load-more browsing and actual Resend delivery on the deployed environment. Existing live Razorpay and refund verification requirements remain.
- Media has bounded launch capacity and anonymous-upload rate limits; storage is intentionally documented rather than presented as unlimited.

Banner/rules update: 17 tests pass, including mocked presence API origin enforcement, cookie reuse, active-window count query and public ticker field selection. Production build validates TypeScript. Actual browser dialog interaction, PostgreSQL migration and multi-browser visitor counts still require deployed verification.

Collections/screenshots/sharing update: 19 tests pass. New checks reject unsafe, duplicate and excess screenshot URLs, block public self-assignment to collections, validate admin collection keys, reject unpublished share cards, and render a real PNG with only public selected fields. A sample share card was visually inspected. Production build passes. Live database migration, mobile sharing and native gallery interactions remain deployment checks.
