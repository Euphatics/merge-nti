-- AlterTable
ALTER TABLE `gallery_images` ADD COLUMN `public_id` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `pyqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_slug` VARCHAR(100) NOT NULL,
    `class_slug` VARCHAR(100) NOT NULL,
    `year` INTEGER NOT NULL,
    `type` ENUM('QUESTION_PAPER', 'ANSWER_KEY', 'SOLUTION') NOT NULL DEFAULT 'QUESTION_PAPER',
    `paper_url` VARCHAR(1000) NOT NULL,
    `public_id` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `pyqs_subject_slug_class_slug_idx`(`subject_slug`, `class_slug`),
    UNIQUE INDEX `pyqs_subject_slug_class_slug_year_type_key`(`subject_slug`, `class_slug`, `year`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `results_subject_slug_class_slug_year_idx` ON `results`(`subject_slug`, `class_slug`, `year`);

