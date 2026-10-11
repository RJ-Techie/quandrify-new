CREATE TABLE "VisitorPresence" (
 "id" TEXT NOT NULL,
 "lastSeen" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "VisitorPresence_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "VisitorPresence_lastSeen_idx" ON "VisitorPresence"("lastSeen");
