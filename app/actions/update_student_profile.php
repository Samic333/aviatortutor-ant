<?php
/**
 * AviatorTutor Update Student Profile Action
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /student/profile");
    exit();
}

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$name = $_POST['name'] ?? '';
$country = $_POST['country'] ?? '';
$timezone = $_POST['timezone'] ?? 'UTC';
$target_license = $_POST['target_license'] ?? '';
$goal_summary = $_POST['goal_summary'] ?? '';

if (empty($name)) {
    $_SESSION['error'] = "Full Name is required.";
    header("Location: /student/profile");
    exit();
}

try {
    $db = Database::getInstance();
    
    // 1. Update User Table
    $db->query("
        UPDATE users 
        SET name = :name, 
            country = :country, 
            timezone = :timezone,
            updated_at = NOW()
        WHERE id = :userId
    ");
    $db->bind(':name', $name);
    $db->bind(':country', $country);
    $db->bind(':timezone', $timezone);
    $db->bind(':userId', $userId);
    $db->execute();
    
    // 2. Update StudentProfile Table
    $db->query("
        UPDATE student_profiles 
        SET target_license = :license, 
            goal_summary = :goal,
            updated_at = NOW()
        WHERE user_id = :userId
    ");
    $db->bind(':license', $target_license);
    $db->bind(':goal', $goal_summary);
    $db->bind(':userId', $userId);
    $db->execute();
    
    // Update session name if changed
    $_SESSION['user_name'] = $name;
    
    $_SESSION['success'] = "Profile updated successfully.";
    header("Location: /student/profile");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Failed to update profile: " . $e->getMessage();
    header("Location: /student/profile");
    exit();
}
