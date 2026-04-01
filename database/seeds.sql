-- AviatorTutor Sample Data Seeds
-- For testing and initial setup

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Users
-- --------------------------------------------------------

-- Password is 'password123' hashed with bcrypt: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `country`, `timezone`) VALUES
('user_admin_1', 'Super Admin', 'admin@aviatortutor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPER_ADMIN', 'United Kingdom', 'UTC'),
('user_instructor_1', 'Captain John Smith', 'instructor@aviatortutor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'INSTRUCTOR', 'United States', 'America/New_York'),
('user_student_1', 'Jane Doe', 'student@aviatortutor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Canada', 'America/Toronto');

-- --------------------------------------------------------
-- Airlines
-- --------------------------------------------------------

INSERT INTO `airlines` (`id`, `name`, `iata_code`, `icao_code`, `country`) VALUES
('airline_1', 'British Airways', 'BA', 'BAW', 'United Kingdom'),
('airline_2', 'Delta Air Lines', 'DL', 'DAL', 'United States'),
('airline_3', 'Emirates', 'EK', 'UAE', 'United Arab Emirates');

-- --------------------------------------------------------
-- Instructor Profiles
-- --------------------------------------------------------

INSERT INTO `instructor_profiles` (`id`, `user_id`, `bio`, `years_of_experience`, `authorities`, `aircraft_types`, `company`, `languages`, `hourly_rate_default`, `rating`, `total_reviews`, `pending_approval`, `airline_id`) VALUES
('prof_instructor_1', 'user_instructor_1', 'Experienced airline captain and flight instructor with over 15 years in the industry. Specialized in ATPL theory and heavy jet operations.', 15, '["FAA", "EASA", "CAA"]', '["B737", "B777", "A320"]', 'Global Flight Prep', '["English", "French"]', 75.00, 4.9, 124, FALSE, 'airline_1');

-- --------------------------------------------------------
-- Student Profiles
-- --------------------------------------------------------

INSERT INTO `student_profiles` (`id`, `user_id`, `target_license`, `authorities_of_interest`, `goal_summary`) VALUES
('prof_student_1', 'user_student_1', 'ATPL', '["FAA", "EASA"]', 'Looking to transition from PPL to CPL and eventually obtain my ATPL. Focused on IFR and navigation.');

-- --------------------------------------------------------
-- Classes
-- --------------------------------------------------------

INSERT INTO `classes` (`id`, `instructor_id`, `title`, `short_description`, `detailed_description`, `type`, `authority`, `authority_standard`, `level`, `tags`, `has_certificate`, `status`, `price_per_hour`, `fixed_price`, `currency`, `max_seats`) VALUES
('class_1', 'prof_instructor_1', 'ATPL Principles of Flight', 'Master the core aerodynamics and flight mechanics.', 'This comprehensive course covers all aspects of Principles of Flight for the ATPL theory examination. Includes lift, drag, stability, and control.', 'ONE_ON_ONE', 'EASA', 'ICAO', 'ATPL', '["Aerodynamics", "ATPL", "Theory"]', TRUE, 'PUBLISHED', 85.00, NULL, 'USD', NULL),
('class_2', 'prof_instructor_1', 'B737 NG Systems Deep Dive', 'Advanced systems training for the 737 Next Generation.', 'A technical walkthrough of all major systems: Hydraulics, Electricals, Pneumatics, and Flight Controls.', 'GROUP', 'FAA', 'ICAO', 'Type Rating', '["B737", "Systems", "Technical"]', TRUE, 'PUBLISHED', NULL, 250.00, 'USD', 10);

-- --------------------------------------------------------
-- System Settings
-- --------------------------------------------------------

INSERT INTO `system_settings` (`id`, `platform_name`, `support_email`, `default_currency`, `maintenance_mode`) VALUES
('sys_1', 'AviatorTutor', 'support@aviatortutor.com', 'USD', FALSE);
