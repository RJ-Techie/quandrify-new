ALTER TABLE "Listing" ADD COLUMN "screenshotUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Listing" ADD COLUMN "collectionKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
CREATE INDEX "Listing_collectionKeys_idx" ON "Listing" USING GIN ("collectionKeys");
