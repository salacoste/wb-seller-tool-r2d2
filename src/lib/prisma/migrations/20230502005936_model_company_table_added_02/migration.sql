/*
  Warnings:

  - Made the column `name` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `name` VARCHAR(191) NOT NULL;