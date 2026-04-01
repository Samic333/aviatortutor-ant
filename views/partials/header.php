<?php
use App\Lib\Auth;
?>
<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4 flex h-16 items-center justify-between">
        <a href="/" class="flex items-center space-x-2">
            <i data-lucide="plane" class="h-6 w-6 text-primary" style="transform: rotate(-45deg);"></i>
            <span class="text-xl font-bold tracking-tight"><?php echo APP_NAME; ?></span>
        </a>

        <nav class="hidden md:flex gap-6 text-sm font-medium">
            <a href="/#how-it-works" class="hover:text-primary transition-colors">How it works</a>
            <a href="/instructors" class="hover:text-primary transition-colors">Find Instructor</a>
            <a href="/classes" class="hover:text-primary transition-colors">Browse Classes</a>
            <a href="/#pricing" class="hover:text-primary transition-colors">Pricing</a>
        </nav>

        <div class="flex items-center gap-4">
            <?php if (Auth::isLoggedIn()): ?>
                <?php 
                $role = Auth::getRole();
                $dashboardUrl = '/student';
                if ($role === 'INSTRUCTOR') $dashboardUrl = '/instructor';
                elseif ($role === 'ADMIN' || $role === 'SUPER_ADMIN') $dashboardUrl = '/admin';
                ?>
                <a href="<?php echo $dashboardUrl; ?>" class="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
                <a href="/logout" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Logout</a>
            <?php else: ?>
                <button onclick="openAuthModal('signin')" class="text-sm font-medium hover:text-primary transition-colors">Sign In</button>
                <button onclick="openAuthModal('signup')" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">Get Started</button>
            <?php endif; ?>
        </div>
    </div>
</header>
