/*
  Warnings:

  - You are about to drop the column `json` on the `pixel` table. All the data in the column will be lost.
  - Added the required column `pixels` to the `Pixel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pixel` DROP COLUMN `json`,
    ADD COLUMN `pixels` JSON NOT NULL;
