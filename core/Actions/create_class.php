<?php
/**
 * AviatorTutor Create Class Action
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /instructor/classes");
    exit();
}

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$title = $_POST['title'] ?? '';
$short_description = $_POST['short_description'] ?? '';
$detailed_description = $_POST['detailed_description'] ?? '';
$syllabus = $_POST['syllabus'] ?? '';
$type = $_POST['type'] ?? 'ONE_ON_ONE';
$authority = $_POST['authority'] ?? '';
$price = (float)($_POST['price'] ?? 0);

if (empty($title) || empty($short_description) || empty($authority)) {
    $_SESSION['error'] = "Missing required fields.";
    header("Location: /instructor/classes/new");
    exit();
}

try {
    $db = Database::getInstance();
    
    // Get Instructor ID
    $db->query("SELECT id FROM instructor_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $instructorProfile = $db->single();
    
    if (!$instructorProfile) {
        throw new \Exception("Instructor profile not found.");
    }
    
    $instructorId = $instructorProfile['id'];
    $classId = 'c_' . bin2hex(random_bytes(8));
    
    // Combine description and syllabus as in original Next.js logic
    $full_description = $detailed_description . (!empty($syllabus) ? "\n\nSyllabus:\n" . $syllabus : "");
    
    $db->query("
        INSERT INTO classes (id, instructor_id, title, short_description, detailed_description, type, authority, price_per_hour, fixed_price, status)
        VALUES (:id, :instructorId, :title, :short_description, :detailed_description, :type, :authority, :price, :fixed_price, 'PUBLISHED')
    ");
    
    $db->bind(':id', $classId);
    $db->bind(':instructorId', $instructorId);
    $db->bind(':title', $title);
    $db->bind(':short_description', $short_description);
    $db->bind(':detailed_description', $full_description);
    $db->bind(':type', $type);
    $db->bind(':authority', $authority);
    
    // Price logic
    if ($type === 'ONE_ON_ONE') {
        $db->bind(':price', $price);
        $db->bind(':fixed_price', null);
    } else {
        $db->bind(':price', null);
        $db->bind(':fixed_price', $price);
    }
    
    $db->execute();
    
    $_SESSION['success'] = "Class created successfully.";
    header("Location: /instructor/classes");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Failed to create class: " . $e->getMessage();
    header("Location: /instructor/classes/new");
    exit();
}
