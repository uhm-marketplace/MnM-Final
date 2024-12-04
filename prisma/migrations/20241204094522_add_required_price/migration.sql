/*
  Warnings:

  - You are about to drop the column `buyerId` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sellerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_sellerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "buyerId",
ALTER COLUMN "price" SET DEFAULT 0.0;

-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInterest" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "ProfileInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectInterest" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "ProjectInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "contact" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_profileId_key" ON "Reviews"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_sellerId_key" ON "Project"("sellerId");

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInterest" ADD CONSTRAINT "ProjectInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInterest" ADD CONSTRAINT "ProjectInterest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
