-- AviatorTutor MySQL Schema
-- Migration from Next.js + PostgreSQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN', 'OWNER') NOT NULL DEFAULT 'STUDENT',
  `image` VARCHAR(255) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `timezone` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `airlines`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `airlines` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `iata_code` VARCHAR(10) DEFAULT NULL,
  `icao_code` VARCHAR(10) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `airlines_name_key` (`name`),
  KEY `airlines_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `instructor_profiles`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `instructor_profiles` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `years_of_experience` INT NOT NULL DEFAULT 0,
  `authorities` JSON DEFAULT NULL, -- Storing array of strings as JSON
  `aircraft_types` JSON DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `languages` JSON DEFAULT NULL,
  `intro_video_url` VARCHAR(255) DEFAULT NULL,
  `hourly_rate_default` DOUBLE DEFAULT NULL,
  `rating` DOUBLE NOT NULL DEFAULT 0,
  `total_reviews` INT NOT NULL DEFAULT 0,
  `pending_approval` BOOLEAN NOT NULL DEFAULT TRUE,
  `airline_id` VARCHAR(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `instructor_profiles_user_id_key` (`user_id`),
  CONSTRAINT `instructor_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `instructor_profiles_airline_id_fkey` FOREIGN KEY (`airline_id`) REFERENCES `airlines` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `student_profiles`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `target_license` VARCHAR(100) DEFAULT NULL,
  `authorities_of_interest` JSON DEFAULT NULL,
  `goal_summary` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_profiles_user_id_key` (`user_id`),
  CONSTRAINT `student_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `classes`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `classes` (
  `id` VARCHAR(191) NOT NULL,
  `instructor_id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `short_description` VARCHAR(255) DEFAULT NULL,
  `detailed_description` TEXT DEFAULT NULL,
  `type` ENUM('ONE_ON_ONE', 'GROUP', 'CHAT') NOT NULL,
  `authority` VARCHAR(100) DEFAULT NULL,
  `authority_standard` VARCHAR(100) DEFAULT NULL,
  `level` VARCHAR(100) DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `has_certificate` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `price_per_hour` DOUBLE DEFAULT NULL,
  `fixed_price` DOUBLE DEFAULT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `max_seats` INT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `classes_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `instructor_profiles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `class_sessions`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `class_sessions` (
  `id` VARCHAR(191) NOT NULL,
  `class_id` VARCHAR(191) NOT NULL,
  `start_time` DATETIME(3) NOT NULL,
  `end_time` DATETIME(3) NOT NULL,
  `timezone` VARCHAR(100) DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  `meeting_url` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT NULL,
  `zoom_meeting_id` VARCHAR(255) DEFAULT NULL,
  `zoom_join_url` VARCHAR(255) DEFAULT NULL,
  `zoom_start_url` VARCHAR(255) DEFAULT NULL,
  `zoom_password` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `class_sessions_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `bookings`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(191) NOT NULL,
  `student_id` VARCHAR(191) NOT NULL,
  `class_id` VARCHAR(191) NOT NULL,
  `session_id` VARCHAR(191) DEFAULT NULL,
  `scheduled_time` DATETIME(3) DEFAULT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'DISPUTED') NOT NULL DEFAULT 'PENDING',
  `payment_status` ENUM('PENDING', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `price` DOUBLE NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `bookings_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `bookings_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `class_sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `reviews`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(191) NOT NULL,
  `booking_id` VARCHAR(191) NOT NULL,
  `student_id` VARCHAR(191) NOT NULL,
  `instructor_id` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_booking_id_key` (`booking_id`),
  CONSTRAINT `reviews_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `reviews_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `instructor_profiles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `conversations`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `conversations` (
  `id` VARCHAR(191) NOT NULL,
  `topic` VARCHAR(255) DEFAULT NULL,
  `created_by_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `conversations_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `conversation_participants`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `conversation_id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`conversation_id`, `user_id`),
  CONSTRAINT `cp_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cp_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `messages`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `messages` (
  `id` VARCHAR(191) NOT NULL,
  `conversation_id` VARCHAR(191) NOT NULL,
  `sender_id` VARCHAR(191) NOT NULL,
  `content` TEXT NOT NULL,
  `read_at` DATETIME(3) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `notifications`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `support_tickets`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(191) NOT NULL,
  `created_by_id` VARCHAR(191) NOT NULL,
  `booking_id` VARCHAR(191) DEFAULT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('TECHNICAL', 'PAYMENT', 'DISPUTE', 'OTHER') NOT NULL,
  `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
  `admin_owner_id` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `support_tickets_booking_id_key` (`booking_id`),
  CONSTRAINT `support_tickets_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`),
  CONSTRAINT `support_tickets_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `support_tickets_admin_owner_id_fkey` FOREIGN KEY (`admin_owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `certificates`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `certificates` (
  `id` VARCHAR(191) NOT NULL,
  `student_id` VARCHAR(191) NOT NULL,
  `class_id` VARCHAR(191) NOT NULL,
  `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `certificate_code` VARCHAR(191) NOT NULL,
  `metadata_json` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_certificate_code_key` (`certificate_code`),
  CONSTRAINT `certificates_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student_profiles` (`id`),
  CONSTRAINT `certificates_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `audit_logs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actor_id` VARCHAR(191) DEFAULT NULL,
  `actor_role` VARCHAR(50) DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(191) DEFAULT NULL,
  `target_user_id` VARCHAR(191) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL,
  `ip` VARCHAR(50) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_created_at_idx` (`created_at`),
  KEY `audit_logs_actor_id_created_at_idx` (`actor_id`, `created_at`),
  KEY `audit_logs_action_created_at_idx` (`action`, `created_at`),
  KEY `audit_logs_entity_idx` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `system_settings`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` VARCHAR(191) NOT NULL,
  `platform_name` VARCHAR(255) NOT NULL DEFAULT 'AviatorTutor',
  `support_email` VARCHAR(255) NOT NULL DEFAULT 'support@aviatortutor.com',
  `default_currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `maintenance_mode` BOOLEAN NOT NULL DEFAULT FALSE,
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
