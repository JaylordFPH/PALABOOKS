/*
  Warnings:

  - You are about to drop the column `readCount` on the `story` table. All the data in the column will be lost.
  - Added the required column `read_count` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `story` DROP COLUMN `readCount`,
    ADD COLUMN `read_count` INTEGER NOT NULL;
