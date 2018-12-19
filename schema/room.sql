CREATE TABLE IF NOT EXISTS `room` (
    `id` INT UNSIGNED AUTO_INCREMENT,
    `room_name` VARCHAR(50) DEFAULT NULL,
    `room_type` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)