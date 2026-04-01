<?php
/**
 * AviatorTutor Ticket Management Actions
 */

use App\Lib\Database;
use App\Lib\Auth;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /admin/tickets");
    exit();
}

Auth::requireRole('ADMIN');

$ticketId = $_POST['ticket_id'] ?? '';
$action = $_POST['action'] ?? '';

if (empty($ticketId)) {
    $_SESSION['error'] = "Ticket ID is required.";
    header("Location: /admin/tickets");
    exit();
}

try {
    $db = Database::getInstance();
    $adminId = Auth::getUserId();

    if ($action === 'RESOLVE') {
        $db->query("
            UPDATE support_tickets 
            SET status = 'RESOLVED', admin_owner_id = :adminId, updated_at = NOW() 
            WHERE id = :ticketId
        ");
        $db->bind(':adminId', $adminId);
        $db->bind(':ticketId', $ticketId);
        $db->execute();
        $_SESSION['success'] = "Ticket marked as RESOLVED.";
    }

    header("Location: /admin/tickets");
    exit();

} catch (\Exception $e) {
    error_log($e->getMessage());
    $_SESSION['error'] = "Action failed: " . $e->getMessage();
    header("Location: /admin/tickets");
    exit();
}
