<?php
/**
 * AviatorTutor Create Booking & Redirect to Payment Action
 */

use App\Lib\Database;
use App\Lib\Auth;
use App\Services\PaymentService;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /classes");
    exit();
}

// 1. Auth Check - Redirect to login if not logged in
if (!Auth::isLoggedIn()) {
    $_SESSION['redirect_after_login'] = $_SERVER['HTTP_REFERER'] ?? '/classes';
    $_SESSION['error'] = "Please log in to book a class.";
    header("Location: /?auth=signin");
    exit();
}

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$classId = $_POST['class_id'] ?? '';

if (empty($classId)) {
    $_SESSION['error'] = "Invalid class selection.";
    header("Location: /classes");
    exit();
}

try {
    $db = Database::getInstance();
    
    // 2. Fetch Class Details
    $db->query("SELECT * FROM classes WHERE id = :id AND status = 'PUBLISHED'");
    $db->bind(':id', $classId);
    $class = $db->single();
    
    if (!$class) {
        throw new \Exception("Class not found or not available.");
    }
    
    // 3. Fetch Student ID
    $db->query("SELECT id FROM student_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $studentProfile = $db->single();
    $studentId = $studentProfile['id'];

    // 4. Create Booking (Pending)
    $bookingId = 'b_' . bin2hex(random_bytes(8));
    $amount = ($class['fixed_price'] ?: $class['price_per_hour']) * 100; // in cents
    
    $db->query("
        INSERT INTO bookings (id, student_id, class_id, amount, status, payment_status)
        VALUES (:id, :studentId, :classId, :amount, 'PENDING', 'PENDING')
    ");
    
    $db->bind(':id', $bookingId);
    $db->bind(':studentId', $studentId);
    $db->bind(':classId', $classId);
    $db->bind(':amount', $amount / 100); // Storage in main units
    $db->execute();
    
    // 5. Create Stripe Session
    $session = PaymentService::createCheckoutSession([
        'userId' => $userId,
        'bookingId' => $bookingId,
        'classId' => $classId,
        'amount' => $amount,
        'currency' => 'USD',
        'successUrl' => APP_URL . "/student/bookings?success=true&booking_id=" . $bookingId,
        'cancelUrl' => APP_URL . "/classes/" . $classId . "?cancel=true",
    ]);
    
    if ($session && isset($session['url'])) {
        header("Location: " . $session['url']);
        exit();
    } else {
        throw new \Exception("Failed to initialize payment gateway.");
    }

} catch (\Exception $e) {
    error_log("[Bookings] Error: " . $e->getMessage());
    $_SESSION['error'] = "Booking failed: " . $e->getMessage();
    header("Location: " . ($_SERVER['HTTP_REFERER'] ?? '/classes'));
    exit();
}
