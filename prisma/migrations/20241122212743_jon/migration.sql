/*
  Warnings:

  - You are about to drop the `Interest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_interestId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInterest" DROP CONSTRAINT "ProjectInterest_interestId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInterest" DROP CONSTRAINT "ProjectInterest_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "buyerId" INTEGER,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "sellerId" INTEGER;

-- DropTable
DROP TABLE "Interest";

-- DropTable
DROP TABLE "ProfileInterest";

-- DropTable
DROP TABLE "ProjectInterest";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
