<?php
/**
 * AviatorTutor Create New Class Page
 */

use App\Lib\Database;
use App\Lib\Auth;

Auth::requireRole('INSTRUCTOR');

$userId = Auth::getUserId();
$db = Database::getInstance();

try {
    // Check if instructor profile exists and is approved
    $db->query("SELECT * FROM instructor_profiles WHERE user_id = :userId");
    $db->bind(':userId', $userId);
    $instructorProfile = $db->single();

    if (!$instructorProfile || $instructorProfile['pending_approval']) {
        header("Location: /instructor");
        exit();
    }

} catch (\Exception $e) {
    error_log($e->getMessage());
    die("Error verifying instructor status.");
}

$title = "Create New Class - AviatorTutor";
ob_start();
?>

<div class="max-w-3xl mx-auto py-8 px-4 space-y-8">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Create New Class</h1>
        <p class="text-muted-foreground">Set up a new learning opportunity for students.</p>
    </div>

    <form action="/instructor/classes/create" method="POST" class="space-y-8">
        <!-- Tabs Logic (Simple JS) -->
        <div class="space-y-6">
            <div class="flex border-b border-muted">
                <button type="button" onclick="showTab('basics')" id="tab-btn-basics" class="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary">Basics</button>
                <button type="button" onclick="showTab('curriculum')" id="tab-btn-curriculum" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground">Curriculum</button>
                <button type="button" onclick="showTab('pricing')" id="tab-btn-pricing" class="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground">Pricing</button>
            </div>

            <!-- Basics Tab -->
            <div id="tab-basics" class="space-y-6">
                <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Class Title</label>
                        <input type="text" name="title" required placeholder="e.g. A320 Systems Review" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    </div>

                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Short Description (Tagline)</label>
                        <input type="text" name="short_description" required placeholder="Brief tagline (max 150 chars)" maxlength="150" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                    </div>

                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Class Type</label>
                        <select name="type" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary appearance-none">
                            <option value="ONE_ON_ONE">1-on-1 Session</option>
                            <option value="GROUP">Group Class Masterclass</option>
                            <option value="CHAT">Chat-based Consultation</option>
                        </select>
                    </div>

                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Authority (Regulator)</label>
                        <select name="authority" required class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary appearance-none">
                            <option value="">Select Authority</option>
                            <option value="FAA">FAA (USA)</option>
                            <option value="EASA">EASA (Europe)</option>
                            <option value="UK CAA">UK CAA</option>
                            <option value="TC">Transport Canada</option>
                            <option value="CASA">CASA (Australia)</option>
                            <option value="DGCA">DGCA (India)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Curriculum Tab -->
            <div id="tab-curriculum" class="hidden space-y-6">
                <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Detailed Description</label>
                        <textarea name="detailed_description" rows="6" placeholder="Full details about the class..." class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Syllabus (Optional)</label>
                        <textarea name="syllabus" rows="6" placeholder="Weekly breakdown or lesson plan..." class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                </div>
            </div>

            <!-- Pricing Tab -->
            <div id="tab-pricing" class="hidden space-y-6">
                <div class="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                    <div class="grid gap-2">
                        <label class="text-sm font-medium">Price per Hour (USD) or Fixed Price</label>
                        <div class="relative">
                            <span class="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <input type="number" step="0.01" name="price" required class="flex h-10 w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary">
                        </div>
                        <p class="text-xs text-muted-foreground">Service fee (10%) will be deducted from your earnings.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end gap-4 pt-4 border-t">
            <a href="/instructor/classes" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input hover:bg-accent h-10 px-6">Cancel</a>
            <button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-bold h-10 px-8 transition-colors">
                Create Class
            </button>
        </div>
    </form>
</div>

<script>
function showTab(tabId) {
    // Hide all tabs
    document.getElementById('tab-basics').classList.add('hidden');
    document.getElementById('tab-curriculum').classList.add('hidden');
    document.getElementById('tab-pricing').classList.add('hidden');
    
    // Show selected tab
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    
    // Update button styles
    const buttons = ['basics', 'curriculum', 'pricing'];
    buttons.forEach(b => {
        const btn = document.getElementById('tab-btn-' + b);
        if (b === tabId) {
            btn.classList.add('border-primary', 'text-primary');
            btn.classList.remove('border-transparent', 'text-muted-foreground');
        } else {
            btn.classList.remove('border-primary', 'text-primary');
            btn.classList.add('border-transparent', 'text-muted-foreground');
        }
    });
}
</script>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
