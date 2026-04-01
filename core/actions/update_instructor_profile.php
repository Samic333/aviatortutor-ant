<?php
/**
 * AviatorTutor Update Instructor Profile Action
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /instructor/profile/edit");
    exit();
}

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$bio = $_POST['bio'] ?? '';
$yearsExperience = (int)($_POST['years_experience'] ?? 0);
$hourlyRate = (float)($_POST['hourly_rate'] ?? 0);

if (empty($bio)) {
    $_SESSION['error'] = "Bio is required.";
    header("Location: /instructor/profile/edit");
    exit();
}

try {
    $db = Database::getInstance();
    
    $db->query("
        UPDATE instructor_profiles 
        SET bio = :bio, 
            years_of_experience = :years, 
            hourly_rate_default = :rate,
            updated_at = NOW()
        WHERE user_id = :userId
    ");
    
    $db->bind(':bio', $bio);
    $db->bind(':years', $yearsExperience);
    $db->bind(':rate', $hourlyRate);
    $db->bind(':userId', $userId);
    
    $db->execute();
    
    $_SESSION['success'] = "Profile updated successfully.";
    header("Location: /instructor");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Failed to update profile: " . $e->getMessage();
    header("Location: /instructor/profile/edit");
    exit();
}
