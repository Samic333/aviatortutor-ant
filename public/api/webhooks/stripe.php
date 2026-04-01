<?php
/**
 * Stripe Webhook Handler
 */

require_once __DIR__ . '/../../../app/bootstrap.php';

use App\Services\PaymentService;
use App\Lib\Database;

$payload = file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

$event = PaymentService::verifyWebhook($payload, $sig_header, STRIPE_WEBHOOK_SECRET);

if (!$event) {
    http_response_code(400);
    exit();
}

$db = Database::getInstance();

switch ($event['type']) {
    case 'checkout.session.completed':
        $session = $event['data']['object'];
        $metadata = $session['metadata'] ?? [];
        $bookingId = $metadata['bookingId'] ?? null;
        
        if ($bookingId) {
            // Update booking as confirmed
            $db->query("UPDATE bookings SET status = 'CONFIRMED', payment_status = 'COMPLETED' WHERE id = :id");
            $db->bind(':id', $bookingId);
            $db->execute();
        }
        break;
        
    case 'payment_intent.payment_failed':
        // Handle failure if needed
        break;
}

http_response_code(200);
echo json_encode(['status' => 'success']);
