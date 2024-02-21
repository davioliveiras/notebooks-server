/*
  Warnings:

  - Added the required column `code` to the `Notebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE notebook_id_seq;
ALTER TABLE "Notebook" ADD COLUMN     "code" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('notebook_id_seq');
ALTER SEQUENCE notebook_id_seq OWNED BY "Notebook"."id";
