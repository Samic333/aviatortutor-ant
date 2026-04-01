<?php
/**
 * AviatorTutor Instructor Profile Edit Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    $db->query("SELECT * FROM instructor_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $profile = $db->single();

    if (!$profile) {
        // Create an empty profile if none exists (though usually created at registration)
        $profile = [
            'bio' => '',
            'years_of_experience' => 0,
            'hourly_rate_default' => 0
        ];
    }
} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error loading profile.");
}

$title = "Edit Profile - AviatorTutor";
ob_start();
?>

<div class="max-w-3xl mx-auto py-8 px-4 space-y-8">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Edit Profile</h1>
        <p class="text-muted-foreground">Update your public instructor information</p>
    </div>

    <form action="/instructor/profile/update" method="POST" class="space-y-6 max-w-xl">
        <div class="space-y-4">
            <div class="grid gap-2">
                <label for="bio" class="text-sm font-medium">Bio / Professional Summary</label>
                <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell students about your experience..."
                    required
                    class="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                ><?php echo htmlspecialchars($profile['bio'] ?? ''); ?></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <label for="years" class="text-sm font-medium">Years of Experience</label>
                    <input
                        id="years"
                        name="years_experience"
                        type="number"
                        min="0"
                        value="<?php echo (int)($profile['years_of_experience'] ?? 0); ?>"
                        required
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div class="grid gap-2">
                    <label for="rate" class="text-sm font-medium">Hourly Rate ($)</label>
                    <input
                        id="rate"
                        name="hourly_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value="<?php echo (float)($profile['hourly_rate_default'] ?? 0); ?>"
                        required
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
        </div>

        <div class="flex gap-4 pt-4 border-t">
            <a href="/instructor" class="border border-input hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6">Cancel</a>
            <button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-10 px-8 transition-colors">
                Save Profile
            </button>
        </div>
    </form>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
