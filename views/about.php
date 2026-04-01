<?php
/**
 * AviatorTutor About Page
 */

$title = "About Us - AviatorTutor";
ob_start();
?>

<div class="relative py-20 overflow-hidden">
    <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-5xl font-extrabold tracking-tighter mb-6">Empowering the Next Generation of Aviators</h1>
        <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AviatorTutor was born from a simple mission: to make world-class aviation training accessible, affordable, and personalized. We connect aspiring pilots with elite instructors from around the globe.
        </p>
    </div>
</div>

<div class="container mx-auto px-4 py-20">
    <div class="grid md:grid-cols-2 gap-16 items-center">
        <div>
            <h2 class="text-3xl font-bold mb-6">Our Vision</h2>
            <p class="text-lg text-muted-foreground mb-6">
                Aviation training has traditionally been localized and manually intensive. We leverage modern technology to break down geographical barriers, allowing students to learn from experts regardless of where they are stationed.
            </p>
            <ul class="space-y-4">
                <li class="flex items-start gap-3">
                    <i data-lucide="check-circle-2" class="h-6 w-6 text-primary shrink-0"></i>
                    <div>
                        <h4 class="font-bold">Transparent Pricing</h4>
                        <p class="text-sm text-muted-foreground">No hidden fees or long-term contracts. Pay as you learn.</p>
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <i data-lucide="check-circle-2" class="h-6 w-6 text-primary shrink-0"></i>
                    <div>
                        <h4 class="font-bold">Global Network</h4>
                        <p class="text-sm text-muted-foreground">Access instructors with FAA, EASA, and specialized airline experience.</p>
                    </div>
                </li>
                <li class="flex items-start gap-3">
                    <i data-lucide="check-circle-2" class="h-6 w-6 text-primary shrink-0"></i>
                    <div>
                        <h4 class="font-bold">Flexible Learning</h4>
                        <p class="text-sm text-muted-foreground">Schedule sessions around your life, not the other way around.</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="relative">
            <div class="aspect-video rounded-2xl bg-muted overflow-hidden shadow-2xl">
                 <img src="/assets/img/hero-bg.png" alt="Aviation Training" class="object-cover w-full h-full">
            </div>
            <div class="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl hidden lg:block">
                <div class="text-4xl font-bold">10k+</div>
                <div class="text-sm opacity-90">Hours of Training Delivered</div>
            </div>
        </div>
    </div>
</div>

<div class="bg-muted/50 py-20">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-12">Meet the Leadership</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-card p-8 rounded-xl shadow-sm border">
                <div class="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl text-primary">JD</div>
                <h4 class="font-bold">John Doe</h4>
                <p class="text-sm text-muted-foreground mb-4">Founder & Captain</p>
                <p class="text-sm italic">"Training pilots is not just a job; it's a responsibility we take heart to."</p>
            </div>
            <div class="bg-card p-8 rounded-xl shadow-sm border border-primary/20">
                <div class="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl text-primary">AS</div>
                <h4 class="font-bold">Alice Smith</h4>
                <p class="text-sm text-muted-foreground mb-4">Chief Technology Officer</p>
                <p class="text-sm italic">"Building the tools that connect the aviation world safely and reliably."</p>
            </div>
            <div class="bg-card p-8 rounded-xl shadow-sm border">
                <div class="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-2xl text-primary">RK</div>
                <h4 class="font-bold">Robert King</h4>
                <p class="text-sm text-muted-foreground mb-4">Head of Instructor Quality</p>
                <p class="text-sm italic">"Ensuring every session meets the highest safety and regulatory standards."</p>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
