/*
  Warnings:

  - You are about to drop the column `buyerId` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "buyerId";

-- CreateTable
CREATE TABLE "ProjectBuyer" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectBuyer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectBuyer" ADD CONSTRAINT "ProjectBuyer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBuyer" ADD CONSTRAINT "ProjectBuyer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
