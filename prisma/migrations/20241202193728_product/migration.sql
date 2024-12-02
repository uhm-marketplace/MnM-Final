/*
  Warnings:

  - Added the required column `owner` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileReview" DROP CONSTRAINT "ProfileReview_reviewId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "reviewId" INTEGER NOT NULL;
