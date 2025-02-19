/*
  Warnings:

  - You are about to drop the column `password_hash` on the `perusahaan` table. All the data in the column will be lost.
  - You are about to drop the column `picture_perusahaan` on the `perusahaan` table. All the data in the column will be lost.
  - Added the required column `gambar_perusahaan` to the `perusahaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `perusahaan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `perusahaan` DROP COLUMN `password_hash`,
    DROP COLUMN `picture_perusahaan`,
    ADD COLUMN `gambar_perusahaan` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `action` ENUM('LOGOUT', 'LOGIN', 'CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Log_id_key`(`id`),
    INDEX `Log_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refreshtoken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    UNIQUE INDEX `RefreshToken_refresh_token_key`(`refresh_token`),
    INDEX `RefreshToken_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN', 'FREELANCER') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userprofile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_picture` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `UserProfile_phone_number_key`(`phone_number`),
    UNIQUE INDEX `UserProfile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `Log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refreshtoken` ADD CONSTRAINT `RefreshToken_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userprofile` ADD CONSTRAINT `UserProfile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
