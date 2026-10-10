BEGIN;
ALTER TABLE "Payment" ADD COLUMN "promotionalAmount" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'LISTING', ADD COLUMN "couponCode" TEXT, ADD COLUMN "discountAmount" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "paidAt" TIMESTAMP(3);
UPDATE "Payment" SET "promotionalAmount" = CASE WHEN "hasTop10Addon" THEN 9900 ELSE 0 END, "paidAt" = "updatedAt", "kind" = CASE WHEN "amount" = 9900 AND "hasTop10Addon" THEN 'PROMOTION' ELSE 'LISTING' END;
CREATE TABLE "Coupon" ("id" TEXT PRIMARY KEY, "code" TEXT NOT NULL UNIQUE, "type" TEXT NOT NULL, "value" INTEGER NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "SponsoredAd" ("id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "imageUrl" TEXT, "targetUrl" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);

ALTER TABLE "Payment" ADD COLUMN "originalPromotionalAmount" INTEGER NOT NULL DEFAULT 0;
UPDATE "Payment" SET "originalPromotionalAmount" = "promotionalAmount";
CREATE INDEX "Payment_status_promotionalAmount_idx" ON "Payment"("status", "promotionalAmount");

COMMIT;
