/*
  Warnings:

  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `status` ENUM('PRESENT', 'LATE') NOT NULL;
