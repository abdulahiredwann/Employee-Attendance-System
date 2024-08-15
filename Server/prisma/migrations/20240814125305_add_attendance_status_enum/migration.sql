-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PRESENT', 'LATE', 'ABSENT') NOT NULL;
