/*
  Warnings:

  - Added the required column `instituteId` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ResearchInstitute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Study" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instituteId" TEXT NOT NULL,
    CONSTRAINT "Study_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "ResearchInstitute" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Study" ("category", "createdAt", "description", "id", "location", "maxParticipants", "startDate", "title") SELECT "category", "createdAt", "description", "id", "location", "maxParticipants", "startDate", "title" FROM "Study";
DROP TABLE "Study";
ALTER TABLE "new_Study" RENAME TO "Study";
CREATE INDEX "Study_instituteId_idx" ON "Study"("instituteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
