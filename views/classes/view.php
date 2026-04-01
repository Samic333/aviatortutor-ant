<?php
/**
 * AviatorTutor Class Details Page
 */

use App\Lib\Database;
use App\Lib\Auth;

$classId = $_GET['id'] ?? null;
if (!$classId) {
    header("Location: /classes");
    exit();
}

$db = Database::getInstance();

try {
    $db->query("
        SELECT c.*, u.name as instructor_name, u.image as instructor_image, ip.bio as instructor_bio, ip.id as instructor_profile_id, ip.user_id as instructor_user_id
        FROM classes c
        JOIN instructor_profiles ip ON c.instructor_id = ip.id
        JOIN users u ON ip.user_id = u.id
        WHERE c.id = :id
    ");
    $db->bind(':id', $classId);
    $class = $db->single();

    if (!$class) {
        require_once APP_ROOT . '/views/404.php';
        exit();
    }

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading class details.");
}

$user = Auth::getCurrentUser();
$isInstructor = $user && $user['id'] === $class['instructor_user_id'];
$isStudent = $user && $user['role'] === 'STUDENT';

$title = $class['title'] . " - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-10">
    <div class="grid lg:grid-cols-3 gap-10">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
            <div>
                <div class="flex items-center gap-4 mb-4">
                    <span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground text-sm px-3 py-1 font-semibold uppercase tracking-wide">
                        <?php echo str_replace('_', ' ', $class['type']); ?>
                    </span>
                    <?php if ($class['authority']): ?>
                        <span class="inline-flex items-center rounded-full border border-input text-sm px-3 py-1 font-semibold">
                            <?php echo $class['authority']; ?>
                        </span>
                    <?php endif; ?>
                </div>
                <h1 class="text-4xl font-bold tracking-tight mb-4"><?php echo htmlspecialchars($class['title']); ?></h1>
                <p class="text-xl text-muted-foreground"><?php echo htmlspecialchars($class['short_description']); ?></p>
            </div>

            <div class="flex items-center gap-6 text-sm text-muted-foreground">
                <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold overflow-hidden">
                        <?php if ($class['instructor_image']): ?>
                            <img src="<?php echo $class['instructor_image']; ?>" alt="">
                        <?php else: ?>
                            <?php echo strtoupper($class['instructor_name'][0]); ?>
                        <?php endif; ?>
                    </div>
                    <span class="font-medium text-foreground"><?php echo htmlspecialchars($class['instructor_name']); ?></span>
                </div>
                <div class="flex items-center gap-1">
                    <i data-lucide="shield-check" class="h-4 w-4"></i>
                    Certified Instructor
                </div>
                <div class="flex items-center gap-1">
                    <i data-lucide="clock" class="h-4 w-4"></i>
                    <?php echo $class['type'] === 'ONE_ON_ONE' ? '60 min sessions' : 'Fixed duration'; ?>
                </div>
            </div>

            <div class="prose dark:prose-invert max-w-none">
                <h3 class="text-xl font-semibold mb-4">About this class</h3>
                <p class="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    <?php echo nl2br(htmlspecialchars($class['detailed_description'] ?: $class['short_description'])); ?>
                </p>
            </div>

            <!-- Features -->
            <div class="border rounded-lg p-6 bg-card shadow-sm">
                <h3 class="font-semibold mb-4">What you'll learn</h3>
                <ul class="grid sm:grid-cols-2 gap-4">
                    <li class="flex items-start gap-2 text-sm">
                        <i data-lucide="check-circle-2" class="h-4 w-4 text-primary shrink-0 mt-0.5"></i>
                        <span>One-on-one expert guidance</span>
                    </li>
                    <li class="flex items-start gap-2 text-sm">
                        <i data-lucide="check-circle-2" class="h-4 w-4 text-primary shrink-0 mt-0.5"></i>
                        <span>Customized training plan</span>
                    </li>
                    <li class="flex items-start gap-2 text-sm">
                        <i data-lucide="check-circle-2" class="h-4 w-4 text-primary shrink-0 mt-0.5"></i>
                        <span>Review and feedback</span>
                    </li>
                    <li class="flex items-start gap-2 text-sm">
                        <i data-lucide="check-circle-2" class="h-4 w-4 text-primary shrink-0 mt-0.5"></i>
                        <span>Valid training certificates</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Sidebar / Booking Card -->
        <div class="space-y-6">
            <div class="rounded-lg border bg-card text-card-foreground shadow-lg sticky top-24 border-primary/10 overflow-hidden">
                <div class="p-6 space-y-6">
                    <div class="flex justify-between items-center text-3xl font-bold">
                        <span>
                            $<?php echo number_format($class['fixed_price'] ?: $class['price_per_hour'], 0); ?>
                        </span>
                        <span class="text-sm font-normal text-muted-foreground mt-2">
                            <?php echo $class['fixed_price'] ? 'Total' : 'per session'; ?>
                        </span>
                    </div>

                    <?php if ($isInstructor): ?>
                        <a href="/instructor/classes/edit?id=<?php echo $class['id']; ?>" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-11 px-8">
                            Edit Class
                        </a>
                    <?php else: ?>
                        <form action="/bookings/create" method="POST">
                            <input type="hidden" name="class_id" value="<?php echo $class['id']; ?>">
                            <button type="submit" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-11 px-8 transition-transform hover:scale-[1.02]">
                                Book Now
                            </button>
                        </form>
                    <?php endif; ?>
                    
                    <p class="text-xs text-center text-muted-foreground mt-4 italic">
                        100% Satisfaction Guarantee. Secure payment processing.
                    </p>
                </div>
            </div>

            <!-- Instructor Mini Profile -->
            <div class="rounded-lg border bg-muted/30 p-6 space-y-4 shadow-sm">
                <div class="flex items-start gap-4">
                    <div class="h-12 w-12 shrink-0 rounded-full bg-background flex items-center justify-center border font-bold text-lg overflow-hidden">
                        <?php if ($class['instructor_image']): ?>
                            <img src="<?php echo $class['instructor_image']; ?>" alt="">
                        <?php else: ?>
                            <?php echo strtoupper($class['instructor_name'][0]); ?>
                        <?php endif; ?>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg"><?php echo htmlspecialchars($class['instructor_name']); ?></h4>
                        <p class="text-sm text-muted-foreground line-clamp-3 mb-4">
                            <?php echo htmlspecialchars($class['instructor_bio'] ?: "Experienced Aviation Instructor"); ?>
                        </p>
                        <a href="/instructors/<?php echo $class['instructor_profile_id']; ?>" class="text-sm font-bold text-primary hover:underline">
                            View Full Profile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
