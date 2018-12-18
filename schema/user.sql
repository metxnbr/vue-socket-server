CREATE TABLE IF NOT EXISTS `user`(
  `id` INT UNSIGNED AUTO_INCREMENT,
  `username` varchar(80) NOT NULL, 
  `password` varchar(80) NOT NULL, 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY ( `id` )
  )