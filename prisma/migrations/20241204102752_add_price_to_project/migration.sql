/*
  Warnings:

  - You are about to drop the column `sellerId` on the `Project` table. All the data in the column will be lost.
  - Made the column `price` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Project_sellerId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "sellerId",
ADD COLUMN     "buyerId" TEXT,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" DROP DEFAULT;
