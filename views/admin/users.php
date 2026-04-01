<?php
/**
 * AviatorTutor Admin User Management Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('ADMIN');

$db = Database::getInstance();

try {
    // 1. Fetch all users
    $db->query("
        SELECT u.*, 
        ip.pending_approval as instructor_pending,
        ip.id as instructor_profile_id
        FROM users u
        LEFT JOIN instructor_profiles ip ON u.id = ip.user_id
        ORDER BY u.created_at DESC
    ");
    $allUsers = $db->resultSet();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading user management.");
}

$title = "User Management - Admin Dashboard";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">User Management</h1>
            <p class="text-muted-foreground">Manage accounts, roles, and instructor approvals.</p>
        </div>
        <div class="flex gap-2">
            <!-- Filter buttons or Search bar could go here -->
        </div>
    </div>

    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom text-sm border-collapse">
                <thead>
                    <tr class="border-b transition-colors hover:bg-muted/50">
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                        <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                    <?php foreach ($allUsers as $u): ?>
                        <tr class="border-b transition-colors hover:bg-muted/50">
                            <td class="p-4 align-middle font-bold"><?php echo htmlspecialchars($u['name'] ?: "Unnamed User"); ?></td>
                            <td class="p-4 align-middle"><?php echo htmlspecialchars($u['email']); ?></td>
                            <td class="p-4 align-middle">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold <?php echo getRoleClasses($u['role']); ?>">
                                    <?php echo $u['role']; ?>
                                </span>
                            </td>
                            <td class="p-4 align-middle">
                                <?php if ($u['role'] === 'INSTRUCTOR'): ?>
                                    <?php if ($u['instructor_pending']): ?>
                                        <span class="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">Pending Approval</span>
                                    <?php else: ?>
                                        <span class="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium">Approved</span>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <span class="text-muted-foreground text-xs italic">N/A</span>
                                <?php endif; ?>
                            </td>
                            <td class="p-4 align-middle text-muted-foreground"><?php echo date('M j, Y', strtotime($u['created_at'])); ?></td>
                            <td class="p-4 align-middle text-right">
                                <div class="flex justify-end gap-2">
                                    <?php if ($u['role'] === 'INSTRUCTOR' && $u['instructor_pending']): ?>
                                        <form action="/admin/user/approve" method="POST">
                                            <input type="hidden" name="user_id" value="<?php echo $u['id']; ?>">
                                            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Approve</button>
                                        </form>
                                    <?php endif; ?>
                                    <form action="/admin/user/delete" method="POST" onsubmit="return confirm('Are you sure you want to delete this user? This cannot be undone.');">
                                        <input type="hidden" name="user_id" value="<?php echo $u['id']; ?>">
                                        <button type="submit" class="text-red-500 hover:text-red-700 p-1 transition-colors">
                                             <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php
function getRoleClasses($role) {
    switch ($role) {
        case 'ADMIN': return 'bg-purple-100 text-purple-800';
        case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800';
        case 'STUDENT': return 'bg-gray-100 text-gray-800';
        default: return 'bg-muted text-muted-foreground';
    }
}

$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
