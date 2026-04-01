<?php
/**
 * AviatorTutor Instructor Dashboard
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // 1. Fetch Instructor Profile
    $db->query("SELECT * FROM instructor_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $instructorProfile = $db->single();

    if (!$instructorProfile) {
        $title = "Become an Instructor - AviatorTutor";
        ob_start();
        ?>
        <div class="flex flex-col items-center justify-center p-12 text-center min-h-[60vh]">
            <div class="bg-primary/10 p-6 rounded-full mb-6">
                <i data-lucide="graduation-cap" class="h-12 w-12 text-primary"></i>
            </div>
            <h1 class="text-3xl font-bold mb-4">Become an Instructor</h1>
            <p class="max-w-md text-muted-foreground mb-8 text-lg">
                You haven't set up your instructor profile yet. Please complete your profile to start creating classes and earning.
            </p>
            <a href="/instructor/profile" class="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-bold flex items-center justify-center">
                Create Profile
            </a>
        </div>
        <?php
        $content = ob_get_clean();
        include APP_ROOT . '/views/layouts/main.php';
        exit();
    }

    if ($instructorProfile['pending_approval']) {
        $title = "Application Pending - AviatorTutor";
        ob_start();
        ?>
        <div class="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <div class="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-full mb-6">
                <i data-lucide="star" class="h-12 w-12 text-yellow-600 dark:text-yellow-400"></i>
            </div>
            <h2 class="text-3xl font-bold tracking-tight mb-4">Application Under Review</h2>
            <p class="text-muted-foreground max-w-md mb-8 text-lg">
                Your instructor application is currently being reviewed by our team. We'll notify you once you're approved to teach.
            </p>
            <div class="flex gap-4">
                <a href="/instructor/profile" class="border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md font-bold flex items-center justify-center">
                    View Profile
                </a>
                <a href="/support" class="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-bold flex items-center justify-center">
                    Contact Support
                </a>
            </div>
        </div>
        <?php
        $content = ob_get_clean();
        include APP_ROOT . '/views/layouts/main.php';
        exit();
    }

    // 2. Stats
    // Earnings (placeholder logic)
    $totalEarnings = 0;
    
    // Upcoming Sessions
    $db->query("
        SELECT b.*, c.title, u.name as student_name
        FROM bookings b
        JOIN classes c ON b.class_id = c.id
        JOIN users u ON b.student_id = u.id
        WHERE c.instructor_id = :instructorId AND b.status = 'CONFIRMED'
        ORDER BY b.scheduled_time ASC
        LIMIT 5
    ");
    $db->bind(':instructorId', $instructorProfile['id']);
    $upcomingSessions = $db->resultSet();

    // Unique Students
    $db->query("
        SELECT COUNT(DISTINCT student_id) as count 
        FROM bookings b
        JOIN classes c ON b.class_id = c.id
        WHERE c.instructor_id = :instructorId
    ");
    $db->bind(':instructorId', $instructorProfile['id']);
    $totalStudents = $db->single()['count'] ?? 0;

    $rating = (float)$instructorProfile['rating'] ?: 0.0;
    $totalReviews = (int)$instructorProfile['total_reviews'] ?: 0;

    // Profile completeness check
    $isProfileComplete = !empty($instructorProfile['bio']) && !empty($instructorProfile['hourly_rate_default']);

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading instructor dashboard.");
}

$title = "Instructor Dashboard - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <?php if (!$isProfileComplete): ?>
        <div class="bg-blue-600 text-white p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div class="flex items-center gap-3">
                <i data-lucide="info" class="h-6 w-6"></i>
                <p class="font-medium">Complete your profile to increase your visibility and attract more students.</p>
            </div>
            <a href="/instructor/profile" class="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">Edit Profile</a>
        </div>
    <?php endif; ?>

    <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div class="flex gap-2">
            <a href="/instructor/classes/new" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-10 px-4 py-2">
                <i data-lucide="plus" class="mr-2 h-4 w-4"></i>
                Create Class
            </a>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Total Earnings</h3>
                <i data-lucide="dollar-sign" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">$<?php echo number_format($totalEarnings, 0); ?></div>
                <p class="text-xs text-muted-foreground">Lifetime</p>
            </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Upcoming Sessions</h3>
                <i data-lucide="book-open" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo count($upcomingSessions); ?></div>
            </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Total Students</h3>
                <i data-lucide="users" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo $totalStudents; ?></div>
            </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Rating</h3>
                <i data-lucide="star" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo number_format($rating, 1); ?></div>
                <p class="text-xs text-muted-foreground"><?php echo $totalReviews; ?> reviews</p>
            </div>
        </div>
    </div>

    <!-- Upcoming Sessions Card -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="p-6">
            <h1 class="text-lg font-semibold leading-none tracking-tight mb-4">Upcoming Sessions</h1>
            <?php if (empty($upcomingSessions)): ?>
                <div class="flex flex-col items-center justify-center py-12 text-center border-t border-dashed mt-4">
                    <div class="bg-primary/10 p-4 rounded-full mb-4">
                        <i data-lucide="calendar" class="h-8 w-8 text-primary"></i>
                    </div>
                    <h3 class="font-semibold text-lg mb-2">No Upcoming Sessions</h3>
                    <p class="text-muted-foreground max-w-sm">
                        You don't have any sessions scheduled currently. New bookings will appear here.
                    </p>
                </div>
            <?php else: ?>
                <div class="space-y-4 mt-4">
                    <?php foreach ($upcomingSessions as $booking): ?>
                        <div class="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p class="font-medium"><?php echo htmlspecialchars($booking['title']); ?></p>
                                <p class="text-sm text-muted-foreground">
                                    with <?php echo htmlspecialchars($booking['student_name']); ?> • 
                                    <?php echo $booking['scheduled_time'] ? date('M j, Y, g:i A', strtotime($booking['scheduled_time'])) : "Date TBD"; ?>
                                </p>
                            </div>
                            <a href="/instructor/bookings" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4">View</a>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
