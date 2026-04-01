<?php
$title = "404 - Page Not Found";
ob_start();
?>
<div class="container mx-auto px-4 py-20 text-center">
    <div class="flex flex-col items-center justify-center gap-6">
        <div class="rounded-full bg-muted p-6">
            <i data-lucide="plane" class="h-12 w-12 text-muted-foreground"></i>
        </div>
        <h1 class="text-4xl font-black tracking-tight">404 - Off Course</h1>
        <p class="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back to the runway.
        </p>
        <a href="/" class="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-bold flex items-center gap-2">
            Return Home <i data-lucide="home" class="h-4 w-4"></i>
        </a>
    </div>
</div>
<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
