<?php
/**
 * AviatorTutor Configuration
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'fruinxrj_aviatortutor');
define('DB_USER', 'fruinxrj_aviator_user');
define('DB_PASS', 'DtY2RSVwLLL(');
define('DB_CHARSET', 'utf8mb4');

// App Configuration
define('APP_NAME', 'AviatorTutor');
define('APP_URL', 'https://aviatortutor.com');
define('APP_ROOT', dirname(__DIR__));

// Security
define('SESSION_NAME', 'aviatortutor_session');
define('HASH_ALGORITHM', PASSWORD_BCRYPT);
define('TOKEN_EXPIRY', 3600); // 1 hour

// Error Reporting (Development)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Stripe Configuration
define('STRIPE_SECRET_KEY', 'sk_test_51P...placeholder');
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_51P...placeholder');
define('STRIPE_WEBHOOK_SECRET', 'whsec_...placeholder');

// Timezone
date_default_timezone_set('UTC');
