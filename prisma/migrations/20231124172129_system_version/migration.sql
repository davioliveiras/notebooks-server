/*
  Warnings:

  - You are about to drop the column `version` on the `System` table. All the data in the column will be lost.
  - Added the required column `system_version` to the `Notebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notebook" ADD COLUMN     "system_version" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "System" DROP COLUMN "version";
