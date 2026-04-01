<?php
/**
 * AviatorTutor Admin Support Tickets Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('ADMIN');

$db = Database::getInstance();

try {
    $db->query("
        SELECT st.*, u.name as user_name, u.email as user_email, b.status as booking_status, c.title as class_title
        FROM support_tickets st
        LEFT JOIN users u ON st.created_by_id = u.id
        LEFT JOIN bookings b ON st.booking_id = b.id
        LEFT JOIN classes c ON b.class_id = c.id
        ORDER BY st.created_at DESC
    ");
    $allTickets = $db->resultSet();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading tickets management.");
}

$title = "Support Ticket Management - Admin";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Support Ticket Management</h1>
            <p class="text-muted-foreground">Manage and resolve user disputes and inquiries.</p>
        </div>
    </div>

    <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div class="relative w-full overflow-auto">
            <table class="w-full text-sm border-collapse">
                <thead>
                    <tr class="border-b bg-muted/50">
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">ID</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">User</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Subject</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Status / Priority</th>
                        <th class="h-12 px-4 text-left font-medium text-muted-foreground">Context</th>
                        <th class="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0 text-muted-foreground">
                    <?php if (empty($allTickets)): ?>
                        <tr><td colspan="6" class="p-8 text-center">No tickets found.</td></tr>
                    <?php else: ?>
                        <?php foreach ($allTickets as $t): ?>
                            <tr class="border-b hover:bg-muted/30 transition-colors">
                                <td class="p-4 align-middle font-mono text-[10px] uppercase"><?php echo $t['id']; ?></td>
                                <td class="p-4 align-middle text-foreground">
                                    <div class="flex flex-col">
                                        <span class="font-bold"><?php echo htmlspecialchars($t['user_name'] ?: 'Guest'); ?></span>
                                        <span class="text-[10px] text-muted-foreground"><?php echo htmlspecialchars($t['user_email'] ?: 'No email'); ?></span>
                                    </div>
                                </td>
                                <td class="p-4 align-middle text-foreground font-medium"><?php echo htmlspecialchars($t['subject']); ?></td>
                                <td class="p-4 align-middle">
                                    <div class="flex flex-col gap-1">
                                        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold <?php echo getTicketStatusClasses($t['status']); ?>">
                                            <?php echo $t['status']; ?>
                                        </span>
                                        <span class="text-[10px] font-bold uppercase <?php echo ($t['priority'] == 'URGENT') ? 'text-red-600' : 'text-muted-foreground'; ?>">
                                            Priority: <?php echo $t['priority']; ?>
                                        </span>
                                    </div>
                                </td>
                                <td class="p-4 align-middle">
                                    <div class="flex flex-col text-[10px]">
                                        <span><?php echo $t['class_title'] ?: 'General Inquiry'; ?></span>
                                        <?php if ($t['booking_id']): ?>
                                            <span class="text-primary font-bold">Booking: <?php echo $t['booking_id']; ?> (<?php echo $t['booking_status']; ?>)</span>
                                        <?php endif; ?>
                                    </div>
                                </td>
                                <td class="p-4 align-middle text-right">
                                    <div class="flex justify-end gap-2 text-xs font-bold">
                                        <form action="/admin/tickets/action" method="POST">
                                            <input type="hidden" name="ticket_id" value="<?php echo $t['id']; ?>">
                                            <input type="hidden" name="action" value="RESOLVE">
                                            <button type="submit" class="text-green-600 hover:text-green-800 underline">Resolve</button>
                                        </form>
                                        <a href="/admin/tickets/view?id=<?php echo $t['id']; ?>" class="text-muted-foreground underline">View Details</a>
                                    </div>
                                </td>
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
