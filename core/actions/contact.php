<?php
/**
 * AviatorTutor Send Contact Action
 * Stores the inquiry in the database and would normally send an email.
 */

use App\Lib\Database;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /contact");
    exit();
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$subject = $_POST['subject'] ?? 'General Inquiry';
$message = $_POST['message'] ?? '';

if (empty($name) || empty($email) || empty($message)) {
    $_SESSION['error'] = "All fields are required.";
    header("Location: /contact");
    exit();
}

try {
    $db = Database::getInstance();
    $ticketId = 'tk_' . bin2hex(random_bytes(8));
    
    // Create a support ticket entry for the inquiry
    $db->query("
        INSERT INTO support_tickets (id, user_id, type, subject, status, priority, created_at)
        VALUES (:id, NULL, 'INQUIRY', :subject, 'OPEN', 'MEDIUM', NOW())
    ");
    $db->bind(':id', $ticketId);
    $db->bind(':subject', "From: $name ($email) - Subject: $subject - Message: $message");
    
    $db->execute();
    
    $_SESSION['success'] = "Thank you for reaching out! Your message has been sent successfully. We'll be in touch soon.";
    header("Location: /contact");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Something went wrong, please try again later.";
    header("Location: /contact");
    exit();
}
