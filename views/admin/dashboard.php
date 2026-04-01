<?php
/**
 * AviatorTutor Admin Dashboard
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('ADMIN');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // 1. Fetch Metrics
    $db->query("SELECT COUNT(*) as count FROM users");
    $totalUsers = $db->single()['count'] ?? 0;

    $db->query("SELECT COUNT(*) as count FROM classes");
    $totalClasses = $db->single()['count'] ?? 0;

    $db->query("SELECT COUNT(*) as count FROM instructor_profiles WHERE pending_approval = TRUE");
    $pendingInstructors = $db->single()['count'] ?? 0;

    $db->query("SELECT COUNT(*) as count FROM support_tickets WHERE status = 'OPEN' AND type = 'DISPUTE'");
    $openDisputes = $db->single()['count'] ?? 0;

    // 2. Recent Activity
    $db->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    $recentUsers = $db->resultSet();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading admin dashboard.");
}

$title = "Admin Dashboard - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p class="text-muted-foreground">Platform overview and management</p>
    </div>

    <!-- Metrics Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Total Users</h3>
                <i data-lucide="users" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo $totalUsers; ?></div>
            </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Total Classes</h3>
                <i data-lucide="book-open" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo $totalClasses; ?></div>
            </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Pending Approvals</h3>
                <i data-lucide="alert-triangle" class="h-4 w-4 text-yellow-500"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold text-yellow-600"><?php echo $pendingInstructors; ?></div>
                <p class="text-xs text-muted-foreground">Instructors awaiting review</p>
            </div>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Open Disputes</h3>
                <i data-lucide="alert-triangle" class="h-4 w-4 text-red-500"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold text-red-600"><?php echo $openDisputes; ?></div>
            </div>
        </div>
    </div>

    <!-- Recent Activity Card -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 leading-none tracking-tight">Recent User Registrations</h3>
            <div class="space-y-4 mt-4">
                <?php if (empty($recentUsers)): ?>
                    <p class="text-sm text-muted-foreground">No recent activity.</p>
                <?php else: ?>
                    <?php foreach ($recentUsers as $user): ?>
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 last:border-0 last:pb-0 gap-2">
                            <div>
                                <p class="font-medium text-gray-900"><?php echo htmlspecialchars($user['name'] ?: "Unnamed User"); ?></p>
                                <p class="text-sm text-muted-foreground"><?php echo htmlspecialchars($user['email']); ?></p>
                            </div>
                            <div class="sm:text-right">
                                <p class="text-sm font-bold text-primary"><?php echo $user['role']; ?></p>
                                <p class="text-xs text-muted-foreground">
                                    <?php echo date('M j, Y', strtotime($user['created_at'])); ?>
                                </p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
