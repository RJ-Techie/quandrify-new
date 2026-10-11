BEGIN;
ALTER TABLE "Listing" ADD COLUMN "adminPromotionalCredit" INTEGER NOT NULL DEFAULT 0, ADD COLUMN "adminCreditGrantedAt" TIMESTAMP(3);
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_adminPromotionalCredit_nonnegative" CHECK ("adminPromotionalCredit" >= 0);
COMMIT;
