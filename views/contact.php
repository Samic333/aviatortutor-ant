<?php
/**
 * AviatorTutor Contact Page
 */

$title = "Contact Us - AviatorTutor";
ob_start();
?>

<div class="container mx-auto px-4 py-20">
    <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-8">
                <div>
                    <h1 class="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
                    <p class="text-lg text-muted-foreground">Have questions about our training or platform? We're here to help you get airborne.</p>
                </div>

                <div class="space-y-6">
                    <div class="flex items-center gap-4 group">
                        <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                             <i data-lucide="mail" class="h-6 w-6"></i>
                        </div>
                        <div>
                            <h4 class="font-bold">Email Support</h4>
                            <p class="text-sm text-muted-foreground">support@aviatortutor.com</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 group">
                        <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                             <i data-lucide="phone" class="h-6 w-6"></i>
                        </div>
                        <div>
                            <h4 class="font-bold">Phone</h4>
                            <p class="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 group">
                        <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                             <i data-lucide="map-pin" class="h-6 w-6"></i>
                        </div>
                        <div>
                            <h4 class="font-bold">Headquarters</h4>
                            <p class="text-sm text-muted-foreground">123 Aviation Way, Sky Harbor, FL 33101</p>
                        </div>
                    </div>
                </div>

                <div class="bg-muted p-6 rounded-2xl border">
                    <h4 class="font-bold mb-2">Office Hours</h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">Monday – Friday: 9am – 6pm EST<br>Saturday: 10am – 2pm EST<br>Sunday: Closed</p>
                </div>
            </div>

            <div class="bg-card p-10 rounded-3xl border shadow-xl shadow-primary/5">
                <form action="/contact/send" method="POST" class="space-y-6">
                    <div class="grid gap-4">
                        <div class="grid gap-2">
                            <label for="name" class="text-sm font-medium">Your Name</label>
                            <input type="text" id="name" name="name" required class="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                        <div class="grid gap-2">
                            <label for="email" class="text-sm font-medium">Your Email</label>
                            <input type="email" id="email" name="email" required class="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                    </div>
                    <div class="grid gap-2">
                        <label for="subject" class="text-sm font-medium">Subject</label>
                        <select id="subject" name="subject" class="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Student Support">Student Support</option>
                            <option value="Instructor Application">Instructor Application</option>
                            <option value="Billing">Billing & Payments</option>
                        </select>
                    </div>
                    <div class="grid gap-2">
                        <label for="message" class="text-sm font-medium">Message</label>
                        <textarea id="message" name="message" rows="5" required class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98]">
                        Send Message
                    </button>
                    <p class="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-none">Typical response time: 2-4 hours</p>
                </form>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include APP_ROOT . '/views/layouts/main.php';
?>
