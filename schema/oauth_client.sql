CREATE TABLE IF NOT EXISTS `oauth_client` (
    `id` INT(10) UNSIGNED AUTO_INCREMENT,
    `secret` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)