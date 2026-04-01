<?php
/**
 * AviatorTutor Student Bookings Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // 1. Fetch Student ID
    $db->query("SELECT id FROM student_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $studentProfile = $db->single();
    $studentId = $studentProfile['id'];

    // 2. Fetch All Bookings
    $db->query("
        SELECT b.*, c.title as class_title, u.name as instructor_name, cs.zoom_join_url
        FROM bookings b
        JOIN classes c ON b.class_id = c.id
        JOIN instructor_profiles ip ON c.instructor_id = ip.id
        JOIN users u ON ip.user_id = u.id
        LEFT JOIN class_sessions cs ON b.session_id = cs.id
        WHERE b.student_id = :studentId
        ORDER BY b.created_at DESC
    ");
    $db->bind(':studentId', $studentId);
    $allBookings = $db->resultSet();

    $upcoming = array_filter($allBookings, fn($b) => in_array($b['status'], ['CONFIRMED', 'PENDING']));
    $past = array_filter($allBookings, fn($b) => $b['status'] === 'COMPLETED');
    $cancelled = array_filter($allBookings, fn($b) => in_array($b['status'], ['CANCELLED', 'DISPUTED']));

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading bookings.");
}

$title = "My Bookings - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p class="text-muted-foreground">Manage your sessions and booking history.</p>
    </div>

    <!-- Tabs Logic (Simple JS) -->
    <div class="space-y-6">
        <div class="flex border-b border-muted">
            <button onclick="showTab('upcoming')" id="tab-btn-upcoming" class="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary transition-colors">Upcoming (<?php echo count($upcoming); ?>)</button>
            <button onclick="showTab('past')" id="tab-btn-past" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">Past (<?php echo count($past); ?>)</button>
            <button onclick="showTab('cancelled')" id="tab-btn-cancelled" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">Cancelled (<?php echo count($cancelled); ?>)</button>
        </div>

        <!-- Tables Content -->
        <div id="tab-content-upcoming">
            <?php renderBookingTable($upcoming); ?>
        </div>
        <div id="tab-content-past" class="hidden">
            <?php renderBookingTable($past); ?>
        </div>
        <div id="tab-content-cancelled" class="hidden">
            <?php renderBookingTable($cancelled); ?>
        </div>
    </div>
</div>

<?php
/**
 * Helper function to render the booking table
 */
function renderBookingTable($bookings) {
    if (empty($bookings)) {
        echo '<div class="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">';
        echo '<p class="text-muted-foreground">No bookings found in this category.</p>';
        echo '</div>';
        return;
    }
    ?>
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom text-sm border-collapse">
                <thead>
                    <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Class</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instructor</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                    </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                    <?php foreach ($bookings as $b): ?>
                        <tr class="border-b transition-colors hover:bg-muted/50">
                            <td class="p-4 align-middle font-medium"><?php echo htmlspecialchars($b['class_title']); ?></td>
                            <td class="p-4 align-middle"><?php echo htmlspecialchars($b['instructor_name']); ?></td>
                            <td class="p-4 align-middle">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold <?php echo getStatusClasses($b['status']); ?>">
                                    <?php echo $b['status']; ?>
                                </span>
                            </td>
                            <td class="p-4 align-middle font-bold">$<?php echo number_format($b['amount'], 2); ?></td>
                            <td class="p-4 align-middle">
                                <?php if ($b['status'] === 'CONFIRMED' && $b['zoom_join_url']): ?>
                                    <a href="<?php echo $b['zoom_join_url']; ?>" target="_blank" class="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                                        Join <i data-lucide="video" class="h-4 w-4"></i>
                                    </a>
                                <?php else: ?>
                                    <a href="/student/bookings/view?id=<?php echo $b['id']; ?>" class="text-muted-foreground hover:text-foreground transition-colors underline">View</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    <?php
}

function getStatusClasses($status) {
    switch ($status) {
        case 'CONFIRMED': return 'bg-green-100 text-green-800';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'COMPLETED': return 'bg-blue-100 text-blue-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        case 'DISPUTED': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
?>

<script>
function showTab(tabId) {
    ['upcoming', 'past', 'cancelled'].forEach(t => {
        document.getElementById('tab-content-' + t).classList.add('hidden');
        const btn = document.getElementById('tab-btn-' + t);
        btn.classList.remove('border-primary', 'text-primary');
        btn.classList.add('border-transparent', 'text-muted-foreground');
    });
    
    document.getElementById('tab-content-' + tabId).classList.remove('hidden');
    const activeBtn = document.getElementById('tab-btn-' + tabId);
    activeBtn.classList.add('border-primary', 'text-primary');
    activeBtn.classList.remove('border-transparent', 'text-muted-foreground');
}
</script>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
