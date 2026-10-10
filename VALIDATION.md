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
