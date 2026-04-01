<?php
// Enable full error reporting for production debugging on Namecheap/cPanel
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * AviatorTutor PHP Front Controller
 */

require_once __DIR__ . '/core/bootstrap.php';

use App\Lib\Auth;
use App\Lib\Database;

// Simple Router
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Standard Routes (GET)
$routes = [
    '/' => 'views/home.php',
    '/about' => 'views/about.php',
    '/contact' => 'views/contact.php',
    '/classes' => 'views/classes.php',
    '/instructors' => 'views/instructors.php',
    '/login' => 'views/auth/login.php',
    '/register' => 'views/auth/register.php',
    '/logout' => 'core/actions/logout.php',
    '/student' => 'views/student/dashboard.php',
    '/student/bookings' => 'views/student/bookings.php',
    '/student/tickets' => 'views/student/tickets.php',
    '/student/profile' => 'views/student/profile.php',
    '/instructor' => 'views/instructor/dashboard.php',
    '/instructor/classes' => 'views/instructor/classes.php',
    '/instructor/classes/new' => 'views/instructor/classes/new.php',
    '/instructor/classes/edit' => 'views/instructor/classes/edit.php',
    '/instructor/profile' => 'views/instructor/profile/edit.php',
    '/instructor/profile/edit' => 'views/instructor/profile/edit.php',
    '/admin' => 'views/admin/dashboard.php',
    '/admin/users' => 'views/admin/users.php',
    '/admin/tickets' => 'views/admin/tickets.php',
    '/super-admin' => 'views/super-admin/dashboard.php',
];

// Action Routes (POST)
$postRoutes = [
    '/login' => 'core/actions/login.php',
    '/register' => 'core/actions/register.php',
    '/contact/send' => 'core/actions/contact.php',
    '/instructor/classes/create' => 'core/actions/create_class.php',
    '/instructor/classes/update' => 'core/actions/update_class.php',
    '/instructor/profile/update' => 'core/actions/update_instructor_profile.php',
    '/student/profile/update' => 'core/actions/update_student_profile.php',
    '/bookings/create' => 'core/actions/create_booking.php',
    '/admin/user/approve' => 'core/actions/admin_user_action.php',
    '/admin/user/delete' => 'core/actions/admin_user_action.php',
    '/admin/tickets/action' => 'core/actions/ticket_action.php',
];

if ($method === 'POST' && isset($postRoutes[$path])) {
    $targetFile = APP_ROOT . '/' . $postRoutes[$path];
    if (file_exists($targetFile)) {
        require_once $targetFile;
        exit();
    }
}

// Handle Dynamic Routes
if (preg_match('/^\/classes\/([a-zA-Z0-9_]+)$/', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require_once APP_ROOT . '/views/classes/view.php';
    exit();
}

if (preg_match('/^\/instructors\/([a-zA-Z0-9_]+)$/', $path, $matches)) {
    $_GET['id'] = $matches[1];
    require_once APP_ROOT . '/views/instructors/view.php';
    exit();
}

if (isset($routes[$path])) {
    $targetFile = APP_ROOT . '/' . $routes[$path];
    if (file_exists($targetFile)) {
        require_once $targetFile;
        exit();
    }
}

// Dashboard sub-paths fallback
if (strpos($path, '/student/') === 0) {
    Auth::requireRole('STUDENT');
    require_once APP_ROOT . '/views/student/dashboard.php';
    exit();
} elseif (strpos($path, '/instructor/') === 0) {
    Auth::requireRole('INSTRUCTOR');
    require_once APP_ROOT . '/views/instructor/dashboard.php';
    exit();
}

// Default 404
http_response_code(404);
if (file_exists(APP_ROOT . '/views/404.php')) {
    require_once APP_ROOT . '/views/404.php';
} else {
    echo "<h1>404 Not Found</h1>";
}
