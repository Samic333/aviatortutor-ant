<footer class="w-full border-t bg-background py-12 md:py-16 lg:py-20 mt-20">
    <div class="container mx-auto px-4">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div class="flex flex-col gap-4">
                <a href="/" class="flex items-center space-x-2">
                    <i data-lucide="plane" class="h-6 w-6 text-primary" style="transform: rotate(-45deg);"></i>
                    <span class="text-xl font-bold tracking-tight"><?php echo APP_NAME; ?></span>
                </a>
                <p class="text-sm text-muted-foreground leading-relaxed">
                    Connecting aspiring pilots with world-class aviation instructors. Experience personalized flight training that fits your schedule.
                </p>
                <div class="flex gap-4">
                    <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                        <i data-lucide="twitter" class="h-5 w-5"></i>
                    </a>
                    <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                        <i data-lucide="linkedin" class="h-5 w-5"></i>
                    </a>
                    <a href="#" class="text-muted-foreground hover:text-primary transition-colors">
                        <i data-lucide="instagram" class="h-5 w-5"></i>
                    </a>
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <h3 class="text-sm font-semibold uppercase tracking-wider">Platform</h3>
                <nav class="flex flex-col gap-2">
                    <a href="/instructors" class="text-sm text-muted-foreground hover:text-primary transition-colors">Find Instructors</a>
                    <a href="/classes" class="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Classes</a>
                    <a href="/#how-it-works" class="text-sm text-muted-foreground hover:text-primary transition-colors">How it works</a>
                    <a href="/#pricing" class="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                </nav>
            </div>
            <div class="flex flex-col gap-4">
                <h3 class="text-sm font-semibold uppercase tracking-wider">Company</h3>
                <nav class="flex flex-col gap-2">
                    <a href="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a>
                    <a href="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                </nav>
            </div>
            <div class="flex flex-col gap-4">
                <h3 class="text-sm font-semibold uppercase tracking-wider">Support</h3>
                <nav class="flex flex-col gap-2">
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Student Guide</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">Instructor Resources</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-primary transition-colors">System Status</a>
                </nav>
            </div>
        </div>
        <div class="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; <?php echo date('Y'); ?> <?php echo APP_NAME; ?>. All rights reserved.</p>
        </div>
    </div>
</footer>
