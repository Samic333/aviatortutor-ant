<?php
/**
 * AviatorTutor Admin User Management Actions
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /admin/users");
    exit();
}

Auth::requireRole('ADMIN');

$requestUri = $_SERVER['REQUEST_URI'];
$userId = $_POST['user_id'] ?? '';

if (empty($userId)) {
    $_SESSION['error'] = "User ID is required.";
    header("Location: /admin/users");
    exit();
}

try {
    $db = Database::getInstance();

    if (strpos($requestUri, '/admin/user/approve') !== false) {
        // Approve Instructor
        $db->query("UPDATE instructor_profiles SET pending_approval = FALSE WHERE user_id = :userId");
        $db->bind(':userId', $userId);
        $db->execute();
        $_SESSION['success'] = "Instructor approved successfully.";

    } elseif (strpos($requestUri, '/admin/user/delete') !== false) {
        // Delete User
        // Note: MySQL Foreign Key constraints with ON DELETE CASCADE should handle profiles/classes
        $db->query("DELETE FROM users WHERE id = :userId");
        $db->bind(':userId', $userId);
        $db->execute();
        $_SESSION['success'] = "User deleted successfully.";
    }

    header("Location: /admin/users");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Action failed: " . $e->getMessage();
    header("Location: /admin/users");
    exit();
}
