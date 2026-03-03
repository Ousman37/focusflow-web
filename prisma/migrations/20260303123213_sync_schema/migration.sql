/*
  Warnings:

  - You are about to drop the column `duration` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "journal_entries" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "sessionId" UUID;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "duration",
ADD COLUMN     "durationMinutes" INTEGER;

-- CreateIndex
CREATE INDEX "journal_entries_sessionId_idx" ON "journal_entries"("sessionId");

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
