/*
  Warnings:

  - Added the required column `userRate` to the `CustomerMeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerMeal" ADD COLUMN     "userRate" TEXT NOT NULL;
