<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title ?? APP_NAME . ' - Flight Instruction Platform'; ?></title>
    <meta name="description" content="<?php echo $description ?? 'Find experienced aviation instructors worldwide. Book 1-on-1 classes, group sessions, and get certified.'; ?>">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind Play CDN (Development) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        primary: {
                            DEFAULT: 'hsl(var(--primary))',
                            foreground: 'hsl(var(--primary-foreground))',
                        },
                        secondary: {
                            DEFAULT: 'hsl(var(--secondary))',
                            foreground: 'hsl(var(--secondary-foreground))',
                        },
                        muted: {
                            DEFAULT: 'hsl(var(--muted))',
                            foreground: 'hsl(var(--muted-foreground))',
                        },
                        accent: {
                            DEFAULT: 'hsl(var(--accent))',
                            foreground: 'hsl(var(--accent-foreground))',
                        },
                        destructive: {
                            DEFAULT: 'hsl(var(--destructive))',
                            foreground: 'hsl(var(--destructive-foreground))',
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                    },
                    borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)',
                    },
                },
            },
        }
    </script>
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="min-h-screen bg-background text-foreground antialiased font-inter">
    
    <!-- Header -->
    <?php include APP_ROOT . '/views/partials/header.php'; ?>

    <!-- Main Content -->
    <main>
        <?php echo $content; ?>
    </main>

    <!-- Footer -->
    <?php include APP_ROOT . '/views/partials/footer.php'; ?>

    <!-- Auth Modal (Replicating Next.js AuthModal) -->
    <div id="auth-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-card text-card-foreground p-6 rounded-lg shadow-xl w-full max-w-sm border relative">
            <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <i data-lucide="x" class="h-5 w-5"></i>
            </button>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col space-y-1.5 text-center px-4">
                    <h3 class="text-2xl font-semibold leading-none tracking-tight" id="auth-modal-title">Sign In</h3>
                    <p class="text-sm text-muted-foreground" id="auth-modal-desc">Enter your credentials to access your account.</p>
                </div>
                
                <div class="flex border-b mb-4">
                    <button onclick="switchAuthMode('signin')" id="btn-signin" class="flex-1 pb-2 text-sm font-medium border-b-2 border-primary">Sign In</button>
                    <button onclick="switchAuthMode('signup')" id="btn-signup" class="flex-1 pb-2 text-sm font-medium border-b-2 border-transparent hover:text-primary transition-all">Get Started</button>
                </div>

                <!-- Sign In Form -->
                <form id="signin-form" class="space-y-4" action="/login" method="POST">
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none" for="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="m@example.com" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none" for="password">Password</label>
                        <input type="password" name="password" id="password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required title="Password must be at least 8 characters long">
                    </div>
                    <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">Sign In</button>
                </form>

                <!-- Sign Up Form (Initially Hidden) -->
                <form id="signup-form" class="hidden space-y-4" action="/register" method="POST">
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none" for="name">Name</label>
                        <input type="text" name="name" id="name" placeholder="John Doe" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none" for="register-email">Email</label>
                        <input type="email" name="email" id="register-email" placeholder="m@example.com" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none" for="register-password">Password</label>
                        <input type="password" name="password" id="register-password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required minlength="8">
                    </div>
                    <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">Create Account</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        // Init Lucide
        lucide.createIcons();

        // Auth Modal Controls
        function openAuthModal(mode = 'signin') {
            const modal = document.getElementById('auth-modal');
            modal.classList.remove('hidden');
            switchAuthMode(mode);
        }

        function closeAuthModal() {
            const modal = document.getElementById('auth-modal');
            modal.classList.add('hidden');
        }

        function switchAuthMode(mode) {
            const signinForm = document.getElementById('signin-form');
            const signupForm = document.getElementById('signup-form');
            const btnSignin = document.getElementById('btn-signin');
            const btnSignup = document.getElementById('btn-signup');
            const title = document.getElementById('auth-modal-title');
            const desc = document.getElementById('auth-modal-desc');

            if (mode === 'signin') {
                signinForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
                btnSignin.classList.add('border-primary');
                btnSignin.classList.remove('border-transparent');
                btnSignup.classList.add('border-transparent');
                btnSignup.classList.remove('border-primary');
                title.innerText = 'Sign In';
                desc.innerText = 'Enter your credentials to access your account.';
            } else {
                signinForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                btnSignup.classList.add('border-primary');
                btnSignup.classList.remove('border-transparent');
                btnSignin.classList.add('border-transparent');
                btnSignin.classList.remove('border-primary');
                title.innerText = 'Create Account';
                desc.innerText = 'Join AviatorTutor to start your aviation journey.';
            }
        }

        // Close on backdrop click
        document.getElementById('auth-modal').addEventListener('click', function(e) {
            if (e.target === this) closeAuthModal();
        });
    </script>
</body>
</html>
