<?php
/**
 * AviatorTutor Student Dashboard
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // 1. Completed Classes Count
    $db->query("SELECT COUNT(*) as count FROM bookings WHERE student_id = :userId AND status = 'COMPLETED'");
    $db->bind(':userId', $userId);
    $completedClasses = $db->single()['count'] ?? 0;

    // 2. Upcoming Sessions
    $db->query("
        SELECT b.*, c.title, u.name as instructor_name, cs.zoom_join_url
        FROM bookings b
        JOIN classes c ON b.class_id = c.id
        JOIN instructor_profiles ip ON c.instructor_id = ip.id
        JOIN users u ON ip.user_id = u.id
        LEFT JOIN class_sessions cs ON b.session_id = cs.id
        WHERE b.student_id = :userId AND b.status = 'CONFIRMED'
        ORDER BY b.scheduled_time ASC
        LIMIT 5
    ");
    $db->bind(':userId', $userId);
    $upcomingBookings = $db->resultSet();

    // 3. Recommended Classes
    $db->query("
        SELECT c.*, u.name as instructor_name
        FROM classes c
        JOIN instructor_profiles ip ON c.instructor_id = ip.id
        JOIN users u ON ip.user_id = u.id
        WHERE c.status = 'PUBLISHED'
        ORDER BY c.created_at DESC
        LIMIT 4
    ");
    $recommendedClasses = $db->resultSet();

    // 4. Student Profile & Completeness
    $db->query("SELECT * FROM users WHERE id = :userId");
    $db->bind(':userId', $userId);
    $user = $db->single();

    $db->query("SELECT * FROM student_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $studentProfile = $db->single();

    // Calculate score
    $score = 0;
    $missing = [];
    if (!empty($user['name'])) $score += 10; else $missing[] = "Name";
    if (!empty($user['image'])) $score += 20; else $missing[] = "Profile Photo";
    if (!empty($user['country'])) $score += 10; else $missing[] = "Country";
    if (!empty($user['timezone'])) $score += 10; else $missing[] = "Timezone";
    if (!empty($studentProfile['target_license'])) $score += 20; else $missing[] = "Target License";
    if (!empty($studentProfile['goal_summary'])) $score += 20; else $missing[] = "Goal Summary";
    if (!empty($user['email'])) $score += 10;
    $completeness = min($score, 100);

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading dashboard.");
}

$title = "Student Dashboard - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-8 space-y-8">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p class="text-muted-foreground">Welcome back, <?php echo htmlspecialchars($user['name']); ?>.</p>
        </div>
        <a href="/instructors" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2">
            Find a Class
        </a>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Completed Classes</h3>
                <i data-lucide="check-circle-2" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo $completedClasses; ?></div>
            </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Upcoming Sessions</h3>
                <i data-lucide="calendar" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold"><?php echo count($upcomingBookings); ?></div>
            </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Certificates</h3>
                <i data-lucide="award" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0">
                <div class="text-2xl font-bold">0</div>
            </div>
        </div>
        <!-- Profile Completeness -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 class="text-sm font-medium">Profile Score</h3>
                <i data-lucide="clock" class="h-4 w-4 text-muted-foreground"></i>
            </div>
            <div class="p-6 pt-0 space-y-2">
                <div class="text-2xl font-bold"><?php echo $completeness; ?>%</div>
                <div class="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full transition-all" style="width: <?php echo $completeness; ?>%;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <!-- Upcoming Sessions List -->
        <div class="col-span-1 lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-4">Upcoming Sessions</h3>
                <?php if (empty($upcomingBookings)): ?>
                    <div class="flex flex-col items-center justify-center h-48 text-center border-t border-dashed mt-4">
                        <i data-lucide="calendar" class="h-10 w-10 text-muted-foreground mb-3"></i>
                        <p class="text-sm text-muted-foreground mb-2">No upcoming sessions scheduled.</p>
                        <a href="/instructors" class="text-primary hover:underline text-sm font-medium">Book starting now</a>
                    </div>
                <?php else: ?>
                    <div class="space-y-4 mt-4">
                        <?php foreach ($upcomingBookings as $booking): ?>
                            <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-gray-50/50">
                                <div class="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                                    <?php echo strtoupper($booking['instructor_name'][0]); ?>
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-900"><?php echo htmlspecialchars($booking['title']); ?></p>
                                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>with <?php echo htmlspecialchars($booking['instructor_name']); ?></span>
                                        <span>•</span>
                                        <span><?php echo $booking['scheduled_time'] ? date('M j, Y', strtotime($booking['scheduled_time'])) : "Date TBD"; ?></span>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <?php if (!empty($booking['zoom_join_url'])): ?>
                                        <a href="<?php echo $booking['zoom_join_url']; ?>" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium">Join Zoom</a>
                                    <?php else: ?>
                                        <a href="/student/bookings/<?php echo $booking['id']; ?>" class="border border-input hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-md text-sm font-medium">Details</a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Recommended Sidebar -->
        <div class="col-span-1 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-4">Recommended</h3>
                <div class="space-y-4">
                    <?php if (empty($recommendedClasses)): ?>
                        <p class="text-sm text-muted-foreground">No recommendations available at the moment.</p>
                    <?php else: ?>
                        <?php foreach ($recommendedClasses as $cls): ?>
                            <a href="/classes/<?php echo $cls['id']; ?>" class="block group">
                                <div class="flex items-start gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                                    <div class="h-10 w-10 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                                        <i data-lucide="book-open" class="h-5 w-5 text-muted-foreground"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium group-hover:text-primary line-clamp-2"><?php echo htmlspecialchars($cls['title']); ?></p>
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 font-semibold">
                                                <?php echo $cls['authority'] ?: 'General'; ?>
                                            </span>
                                            <span class="text-xs text-muted-foreground">
                                                $<?php echo $cls['price_per_hour'] ?: $cls['fixed_price']; ?>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    <a href="/classes" class="block text-center text-xs text-muted-foreground hover:text-primary pt-4 border-t border-dashed transition-colors">
                        View all available classes
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
