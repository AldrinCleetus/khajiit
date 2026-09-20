/*
  Warnings:

  - Added the required column `exchangeMethod` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "exchangeMethod" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
