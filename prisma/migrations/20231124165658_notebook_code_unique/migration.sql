/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Notebook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notebook_code_key" ON "Notebook"("code");
