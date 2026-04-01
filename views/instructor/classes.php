<?php
/**
 * AviatorTutor Instructor Classes Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // 1. Fetch Instructor Profile
    $db->query("SELECT id FROM instructor_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $instructorProfile = $db->single();

    if (!$instructorProfile) {
        header("Location: /instructor");
        exit();
    }

    $instructorId = $instructorProfile['id'];

    // 2. Fetch Classes
    $db->query("
        SELECT c.*, 
        (SELECT COUNT(*) FROM bookings b WHERE b.class_id = c.id) as booking_count
        FROM classes c
        WHERE c.instructor_id = :instructorId
        ORDER BY c.updated_at DESC
    ");
    $db->bind(':instructorId', $instructorId);
    $classes = $db->resultSet();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading classes.");
}

$title = "My Classes - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">My Classes</h1>
            <p class="text-muted-foreground">Manage your curriculum and offerings.</p>
        </div>
        <a href="/instructor/classes/new" class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-bold flex items-center justify-center">
            <i data-lucide="plus" class="mr-2 h-4 w-4"></i> New Class
        </a>
    </div>

    <?php if (empty($classes)): ?>
        <div class="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">
            <i data-lucide="book-open" class="h-12 w-12 text-muted-foreground mb-4"></i>
            <p class="text-muted-foreground mb-6">You haven't created any classes yet.</p>
            <a href="/instructor/classes/new" class="border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md font-bold flex items-center justify-center">
                Create your first class
            </a>
        </div>
    <?php else: ?>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <?php foreach ($classes as $cls): ?>
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                    <div class="p-6 pb-0">
                        <div class="flex justify-between items-start mb-4">
                            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold <?php echo $cls['status'] === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'; ?>">
                                <?php echo $cls['status']; ?>
                            </span>
                            <span class="font-bold text-sm text-primary">
                                $<?php echo $cls['price_per_hour'] ?: $cls['fixed_price']; ?><?php echo $cls['price_per_hour'] ? '/hr' : ''; ?>
                            </span>
                        </div>
                        <h3 class="text-xl font-bold line-clamp-1 mb-1"><?php echo htmlspecialchars($cls['title']); ?></h3>
                        <p class="text-sm text-muted-foreground mb-4">
                            <?php echo $cls['authority']; ?> • <?php echo str_replace('_', ' ', $cls['type']); ?>
                        </p>
                    </div>
                    <div class="p-6 pt-0 flex-1">
                        <div class="flex items-center gap-2 text-sm text-muted-foreground">
                            <i data-lucide="users" class="h-4 w-4"></i>
                            <span><?php echo $cls['booking_count']; ?> Bookings</span>
                        </div>
                    </div>
                    <div class="p-6 pt-0 mt-auto flex justify-between gap-2 border-t pt-4">
                        <a href="/classes/<?php echo $cls['id']; ?>" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent h-9 px-3 flex-1 border">
                            <i data-lucide="eye" class="mr-2 h-4 w-4"></i> View
                        </a>
                        <a href="/instructor/classes/edit?id=<?php echo $cls['id']; ?>" class="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent h-9 px-3 flex-1 border">
                            <i data-lucide="edit" class="mr-2 h-4 w-4"></i> Edit
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
