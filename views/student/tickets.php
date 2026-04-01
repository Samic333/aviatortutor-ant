<?php
/**
 * AviatorTutor Student Support Tickets Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    $db->query("
        SELECT st.*, b.status as booking_status, c.title as class_title
        FROM support_tickets st
        LEFT JOIN bookings b ON st.booking_id = b.id
        LEFT JOIN classes c ON b.class_id = c.id
        WHERE st.created_by_id = :userId
        ORDER BY st.created_at DESC
    ");
    $db->bind(':userId', $userId);
    $tickets = $db->resultSet();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading tickets.");
}

$title = "Support Tickets - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Support & Disputes</h1>
            <p class="text-muted-foreground">Manage your inquiries and booking disputes.</p>
        </div>
        <a href="/contact" class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md text-sm font-bold inline-flex items-center gap-2">
            <i data-lucide="plus" class="h-4 w-4"></i> New Ticket
        </a>
    </div>

    <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div class="relative w-full overflow-auto">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="border-b bg-muted/50">
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">ID</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Subject</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Priority</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Related Class</th>
                        <th class="h-12 px-4 text-right font-medium text-muted-foreground">Created</th>
                    </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0 text-muted-foreground">
                    <?php if (empty($tickets)): ?>
                        <tr><td colspan="6" class="p-8 text-center">No tickets found.</td></tr>
                    <?php else: ?>
                        <?php foreach ($tickets as $t): ?>
                            <tr class="border-b hover:bg-muted/30 transition-colors">
                                <td class="p-4 align-middle font-mono text-[10px] uppercase"><?php echo $t['id']; ?></td>
                                <td class="p-4 align-middle text-foreground font-medium"><?php echo htmlspecialchars($t['subject']); ?></td>
                                <td class="p-4 align-middle">
                                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold <?php echo getTicketStatusClasses($t['status']); ?>">
                                        <?php echo $t['status']; ?>
                                    </span>
                                </td>
                                <td class="p-4 align-middle"><?php echo $t['priority']; ?></td>
                                <td class="p-4 align-middle"><?php echo $t['class_title'] ?: 'General'; ?></td>
                                <td class="p-4 align-middle text-right"><?php echo date('M j, Y', strtotime($t['created_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php
function getTicketStatusClasses($status) {
    switch ($status) {
        case 'OPEN': return 'bg-blue-100 text-blue-800';
        case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
        case 'RESOLVED': return 'bg-green-100 text-green-800';
        case 'CLOSED': return 'bg-gray-100 text-gray-800';
        default: return 'bg-muted text-muted-foreground';
    }
}

$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
