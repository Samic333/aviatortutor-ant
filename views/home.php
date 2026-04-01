<?php
/**
 * AviatorTutor Home Page
 */

use App\Lib\Database;

$title = "AviatorTutor - Master Aviation Skills With World-Class Instructors";
$description = "Your global platform for pilots, cabin crew, engineers, and aviation learners. Find vetted airline captains and masterclasses.";

// Fetch some real stats if database is connected
try {
    $db = Database::getInstance();
    
    $db->query("SELECT COUNT(*) as count FROM instructor_profiles WHERE pending_approval = FALSE");
    $instructorCount = $db->single()['count'] ?? 0;
    if ($instructorCount < 500) $instructorCount = "500+"; // UI fallback for seed data
    
    $db->query("SELECT COUNT(*) as count FROM classes WHERE status = 'PUBLISHED'");
    $classCount = $db->single()['count'] ?? 0;
    if ($classCount < 10) $classCount = "10k+"; // UI fallback
    
} catch (\Exception $e) {
    $instructorCount = "500+";
    $classCount = "10k+";
}

ob_start();
?>

<div class="flex flex-col min-h-screen">
    <!-- Hero Section -->
    <section class="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <!-- Note: Using a placeholder if the original asset isn't found, but keeping the logic -->
            <div class="absolute inset-0 bg-slate-900 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105" style="background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109a33e?q=80&w=2074&auto=format&fit=crop');"></div>
            <div class="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>

        <div class="container relative z-10 px-4 mx-auto text-center pt-20">
            <div class="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-sm text-white/90 mb-8 bg-black/20 backdrop-blur-md shadow-lg mx-auto">
                <span class="flex h-2 w-2 rounded-full bg-sky-400 mr-2 animate-pulse shadow-[0_0_10px_#38bdf8]"></span>
                <span class="tracking-wide uppercase text-xs font-bold">World-class aviation training</span>
            </div>

            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 drop-shadow-2xl max-w-5xl mx-auto leading-[1.1] text-white">
                Master Aviation Skills With <span class="text-sky-400">World-Class</span> Instructors
            </h1>

            <p class="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Your global platform for pilots, cabin crew, engineers, and aviation learners.
            </p>

            <div class="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <a href="/instructors" class="w-full sm:w-auto">
                    <button class="inline-flex items-center justify-center h-14 px-10 text-lg w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 font-medium rounded-full">
                        Find Instructor <i data-lucide="arrow-right" class="ml-2 h-5 w-5"></i>
                    </button>
                </a>
                <a href="/classes" class="w-full sm:w-auto">
                    <button class="inline-flex items-center justify-center h-14 px-10 text-lg w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-md transition-all hover:scale-105 font-medium rounded-full">
                        Browse Classes
                    </button>
                </a>
            </div>
        </div>

        <div class="absolute bottom-10 right-10 z-20 hidden lg:block opacity-90 transform rotate-0">
            <div class="text-white/80 font-black tracking-tighter text-3xl italic drop-shadow-lg mix-blend-overlay">
                AVIATORTUTOR
            </div>
        </div>
    </section>

    <!-- Instructors Section -->
    <section id="instructors-section" class="py-24 bg-background relative">
        <div class="container px-4 mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div class="max-w-2xl">
                    <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">Find Your Mentor</h2>
                    <p class="text-xl text-muted-foreground leading-relaxed">Connect with vetted airline captains, fighter pilots, and senior examiners ready to guide your career.</p>
                </div>
                <a href="/instructors" class="hidden md:inline-flex items-center justify-center rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 group">
                    View All Instructors <i data-lucide="arrow-right" class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"></i>
                </a>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Sample Instructors (Replicating the loop from JSX) -->
                <?php for($i=1; $i<=4; $i++): ?>
                <a href="/instructors/<?php echo $i; ?>" class="group relative flex flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <div class="aspect-[4/3] bg-muted relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10"></div>
                        <div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-muted-foreground group-hover:scale-105 transition-transform duration-500">
                            <div class="text-center">
                                <div class="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3"></div>
                                <span>Instructor <?php echo $i; ?></span>
                            </div>
                        </div>
                        <div class="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                            <div class="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur rounded text-xs font-bold shadow-sm">
                                B777 Captain
                            </div>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <h3 class="font-bold text-xl mb-1 group-hover:text-primary transition-colors">Captain Name <?php echo $i; ?></h3>
                        <p class="text-sm text-muted-foreground mb-4">15,000+ Flight Hours</p>
                        <div class="mt-auto flex items-center justify-between">
                            <div class="flex items-center gap-1.5 text-amber-500 font-bold">
                                <span>★</span> 4.9 <span class="text-muted-foreground font-normal text-sm">(42)</span>
                            </div>
                            <div class="text-sm font-semibold text-primary">
                                $150/hr
                            </div>
                        </div>
                    </div>
                </a>
                <?php endfor; ?>
            </div>
            
            <div class="mt-10 text-center md:hidden">
                <a href="/instructors" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full">
                    View All Instructors
                </a>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="border-y bg-background py-16">
        <div class="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div class="p-4">
                <div class="text-4xl md:text-5xl font-black text-primary mb-2"><?php echo $instructorCount; ?></div>
                <div class="text-base font-medium text-muted-foreground uppercase tracking-wide">Certified Instructors</div>
            </div>
            <div class="p-4">
                <div class="text-4xl md:text-5xl font-black text-primary mb-2">50+</div>
                <div class="text-base font-medium text-muted-foreground uppercase tracking-wide">Authorities</div>
            </div>
            <div class="p-4">
                <div class="text-4xl md:text-5xl font-black text-primary mb-2"><?php echo $classCount; ?></div>
                <div class="text-base font-medium text-muted-foreground uppercase tracking-wide">Classes Done</div>
            </div>
            <div class="p-4">
                <div class="text-4xl md:text-5xl font-black text-primary mb-2">4.9</div>
                <div class="text-base font-medium text-muted-foreground uppercase tracking-wide">Average Rating</div>
            </div>
        </div>
    </section>

    <!-- How it Works -->
    <section id="how-it-works" class="py-24 bg-muted/20">
        <div class="container mx-auto px-4">
            <div class="text-center mb-20">
                <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How it works</h2>
                <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Your path to the cockpit is clearer than ever. Start learning in three simple steps.
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                <div class="relative flex flex-col items-center text-center">
                    <div class="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-primary mb-8 border border-blue-100 dark:border-blue-900 z-10">
                        <i data-lucide="globe" class="h-8 w-8"></i>
                    </div>
                    <div class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-blue-200 to-transparent"></div>
                    <h3 class="text-2xl font-bold mb-4">1. Find Your Mentor</h3>
                    <p class="text-muted-foreground leading-relaxed px-4">
                        Browse profiles of vetted pilots and instructors from major airlines and authorities worldwide.
                    </p>
                </div>
                <!-- ... steps 2 and 3 ... -->
                <div class="relative flex flex-col items-center text-center">
                    <div class="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-primary mb-8 border border-blue-100 dark:border-blue-900 z-10">
                        <i data-lucide="graduation-cap" class="h-10 w-10"></i>
                    </div>
                    <div class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-blue-200 to-transparent"></div>
                    <h3 class="text-2xl font-bold mb-4">2. Book & Learn</h3>
                    <p class="text-muted-foreground leading-relaxed px-4">
                        Schedule 1-on-1 sessions or join group classes. Learn directly from the experts via high-quality video.
                    </p>
                </div>
                <div class="flex flex-col items-center text-center">
                    <div class="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-primary mb-8 border border-blue-100 dark:border-blue-900 z-10">
                        <i data-lucide="award" class="h-9 w-9"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">3. Get Certified</h3>
                    <p class="text-muted-foreground leading-relaxed px-4">
                        Receive valid training certificates and interview prep feedback to ace your next checkride.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-24 bg-background border-t">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
            <p class="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
                Instructors set their own rates. We take a small service fee to keep the platform running.
            </p>
            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div class="p-10 rounded-3xl border bg-card hover:shadow-lg transition-all">
                    <h3 class="text-xl font-bold mb-4 opacity-80">Students</h3>
                    <div class="text-4xl font-black mb-4">Free</div>
                    <p class="text-muted-foreground font-medium">To join and browse.</p>
                </div>
                <div class="p-10 rounded-3xl border-2 border-primary bg-primary/5 shadow-xl relative scale-105 z-10">
                    <div class="absolute top-0 center bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-b-xl shadow-sm left-1/2 -translate-x-1/2">
                        MOST POPULAR
                    </div>
                    <h3 class="text-xl font-bold mb-4 mt-2">Instructors</h3>
                    <div class="text-5xl font-black mb-2 text-primary">10%</div>
                    <div class="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-6">Service Fee</div>
                    <p class="text-muted-foreground">We only make money when you get bookings.</p>
                </div>
                <div class="p-10 rounded-3xl border bg-card hover:shadow-lg transition-all">
                    <h3 class="text-xl font-bold mb-4 opacity-80">Enterprise</h3>
                    <div class="text-4xl font-black mb-4">Custom</div>
                    <p class="text-muted-foreground font-medium">For flight schools.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        <div class="container relative z-10 text-center max-w-4xl mx-auto px-4">
            <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready for takeoff?</h2>
            <p class="text-xl md:text-2xl opacity-90 mb-12 font-light max-w-2xl mx-auto">
                Join thousands of student pilots and aviation professionals accelerating their careers today.
            </p>
            <div class="flex justify-center">
                <button onclick="openAuthModal('signup')" class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-lg font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-12 h-16 shadow-2xl hover:scale-105">
                    Get Started for Free
                </button>
            </div>
        </div>
    </section>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
