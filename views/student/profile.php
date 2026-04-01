<?php
/**
 * AviatorTutor Student Profile Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('STUDENT');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    $db->query("SELECT * FROM users WHERE id = :userId");
    $db->bind(':userId', $userId);
    $user = $db->single();

    $db->query("SELECT * FROM student_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $profile = $db->single();

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading profile.");
}

$title = "My Profile - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-10">
    <div class="max-w-3xl mx-auto space-y-8">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p class="text-muted-foreground">Manage your personal information and training goals.</p>
        </div>

        <form action="/student/profile/update" method="POST" class="space-y-8">
            <!-- Account Info -->
            <div class="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                <h3 class="text-lg font-bold border-b pb-2">Account Information</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="grid gap-2">
                        <label for="name" class="text-sm font-medium">Full Name</label>
                        <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($user['name'] ?? ''); ?>" required class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                    </div>
                    <div class="grid gap-2">
                        <label for="email" class="text-sm font-medium">Email Address</label>
                        <input type="email" id="email" value="<?php echo htmlspecialchars($user['email']); ?>" disabled class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed">
                        <p class="text-[10px] text-muted-foreground uppercase">Email cannot be changed.</p>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="grid gap-2">
                        <label for="country" class="text-sm font-medium">Country</label>
                        <input type="text" id="country" name="country" value="<?php echo htmlspecialchars($user['country'] ?? ''); ?>" placeholder="e.g. United States" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                    </div>
                    <div class="grid gap-2">
                        <label for="timezone" class="text-sm font-medium">Primary Timezone</label>
                        <select id="timezone" name="timezone" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                            <option value="UTC" <?php echo ($user['timezone'] == 'UTC') ? 'selected' : ''; ?>>UTC</option>
                            <option value="EST" <?php echo ($user['timezone'] == 'EST') ? 'selected' : ''; ?>>EST (UTC-5)</option>
                            <option value="CST" <?php echo ($user['timezone'] == 'CST') ? 'selected' : ''; ?>>CST (UTC-6)</option>
                            <option value="MST" <?php echo ($user['timezone'] == 'MST') ? 'selected' : ''; ?>>MST (UTC-7)</option>
                            <option value="PST" <?php echo ($user['timezone'] == 'PST') ? 'selected' : ''; ?>>PST (UTC-8)</option>
                            <option value="GMT" <?php echo ($user['timezone'] == 'GMT') ? 'selected' : ''; ?>>GMT (UTC+0)</option>
                            <option value="CET" <?php echo ($user['timezone'] == 'CET') ? 'selected' : ''; ?>>CET (UTC+1)</option>
                            <option value="IST" <?php echo ($user['timezone'] == 'IST') ? 'selected' : ''; ?>>IST (UTC+5.5)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Training Goals -->
            <div class="rounded-lg border bg-card p-6 shadow-sm space-y-6">
                <h3 class="text-lg font-bold border-b pb-2">Training Goals</h3>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <label for="target_license" class="text-sm font-medium">Target License / Rating</label>
                        <input type="text" id="target_license" name="target_license" value="<?php echo htmlspecialchars($profile['target_license'] ?? ''); ?>" placeholder="e.g. PPL, Instrument Rating, CPL" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                    </div>
                    <div class="grid gap-2">
                        <label for="goal_summary" class="text-sm font-medium">Goal Summary</label>
                        <textarea id="goal_summary" name="goal_summary" rows="4" placeholder="Briefly describe what you're looking to achieve..." class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"><?php echo htmlspecialchars($profile['goal_summary'] ?? ''); ?></textarea>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-4">
                <a href="/student" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input hover:bg-accent h-10 px-6">Cancel</a>
                <button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-10 px-8 transition-colors">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
