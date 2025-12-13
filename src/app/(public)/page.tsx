import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, GraduationCap, Award } from "lucide-react";
import { GetStartedModal } from "@/components/auth/get-started-modal";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/hero-bg-golden.png')] bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105" />
                    {/* Light overlay for brightness, subtle gradient for text readability */}
                    <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>

                {/* Content */}
                <div className="container relative z-10 px-4 mx-auto text-center pt-20">
                    <div className="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-sm text-white/90 mb-8 bg-black/20 backdrop-blur-md shadow-lg">
                        <span className="flex h-2 w-2 rounded-full bg-sky-400 mr-2 animate-pulse shadow-[0_0_10px_#38bdf8]"></span>
                        <span className="tracking-wide uppercase text-xs font-bold">World-class aviation training</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 drop-shadow-2xl max-w-5xl mx-auto leading-[1.1] 
                        text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] [text-shadow:_0_4px_10px_rgba(0,0,0,0.5)]">
                        Master Aviation Skills With <span className="text-white/20 [-webkit-text-stroke:2px_#38bdf8] drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">World-Class</span> Instructors
                    </h1>

                    <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md [text-shadow:_0_1px_2px_rgba(0,0,0,0.6)]">
                        Your global platform for pilots, cabin crew, engineers, and aviation learners.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link href="/#instructors-section" className="w-full sm:w-auto">
                            <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 font-medium rounded-full">
                                Find Instructor <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/#classes-section" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md transition-all hover:scale-105 font-medium rounded-full">
                                Browse Classes
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Simulated "On Aircraft" Logo - Positioned to look like fuselage branding if possible, 
                     but robustly placed in bottom corner as a watermark/tail logo */}
                <div className="absolute bottom-10 right-10 z-20 hidden lg:block opacity-90 transform rotate-0">
                    <div className="text-white/80 font-black tracking-tighter text-3xl italic drop-shadow-lg mix-blend-overlay">
                        AVIATORTUTOR
                    </div>
                </div>
            </section>

            {/* Instructors Section - Priority 2 */}
            <section id="instructors-section" className="py-24 bg-background relative">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Find Your Mentor</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">Connect with vetted airline captains, fighter pilots, and senior examiners ready to guide your career.</p>
                        </div>
                        <Button variant="ghost" asChild className="hidden md:inline-flex text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 group">
                            <Link href="/instructors">View All Instructors <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Sample Instructor Cards */}
                        {[1, 2, 3, 4].map((i) => (
                            <Link href={`/instructors/${i}`} key={i} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10" />
                                    {/* Placeholder for image */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-muted-foreground group-hover:scale-105 transition-transform duration-500">
                                        <div className="text-center">
                                            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3" />
                                            <span>Instructor {i}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                                        <div className="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur rounded text-xs font-bold shadow-sm">
                                            B777 Captain
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 transition-colors">Captain Name {i}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">15,000+ Flight Hours</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                                            <span>★</span> 4.9 <span className="text-muted-foreground font-normal text-sm">(42)</span>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            $150/hr
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-10 text-center md:hidden">
                        <Button variant="outline" size="lg" className="w-full" asChild>
                            <Link href="/instructors">View All Instructors</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Classes Section - Priority 3 */}
            <section id="classes-section" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Upcoming Masterclasses</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">Join live group sessions, webinars, and ground schools. Master complex topics with peers.</p>
                        </div>
                        <Button variant="ghost" asChild className="hidden md:inline-flex text-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 group">
                            <Link href="/classes">Browse Calendar <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Sample Class Cards */}
                        {[1, 2, 3].map((i) => (
                            <Link href={`/classes/${i}`} key={i} className="group flex flex-col rounded-2xl border bg-card hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 p-0 overflow-hidden">
                                <div className="h-2 bg-blue-500 w-full" />
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
                                            Ground School
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                                            Sat, Dec {10 + i}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-2xl mb-3 group-hover:text-blue-600 transition-colors leading-tight">Advanced IFR Procedures & Holding Patterns {i}</h3>
                                    <p className="text-muted-foreground mb-8 line-clamp-2 leading-relaxed">
                                        Master holding patterns, precision approaches, and complex ATC communications in this intensive session designed for serious students.
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-dashed">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" />
                                            <div>
                                                <div className="text-sm font-bold text-foreground">Capt. Sarah</div>
                                                <div className="text-xs text-muted-foreground">Airline Pilot</div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-foreground">
                                            $49
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 text-center md:hidden">
                        <Button variant="outline" size="lg" className="w-full" asChild>
                            <Link href="/classes">Browse Calendar</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats / Trust */}
            <section className="border-y bg-background py-16">
                <div className="container grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">500+</div>
                        <div className="text-base font-medium text-muted-foreground uppercase tracking-wide">Certified Instructors</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">50+</div>
                        <div className="text-base font-medium text-muted-foreground uppercase tracking-wide">Authorities</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">10k+</div>
                        <div className="text-base font-medium text-muted-foreground uppercase tracking-wide">Classes Done</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">4.9</div>
                        <div className="text-base font-medium text-muted-foreground uppercase tracking-wide">Average Rating</div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 bg-muted/20">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How it works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Your path to the cockpit is clearer than ever. Start learning in three simple steps.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-blue-600 mb-8 border border-blue-100 dark:border-blue-900 z-10">
                                <Globe className="h-8 w-8" />
                            </div>
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-blue-200 to-transparent" />

                            <h3 className="text-2xl font-bold mb-4">1. Find Your Mentor</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                Browse profiles of vetted pilots and instructors from major airlines and authorities worldwide.
                            </p>
                        </div>
                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-blue-600 mb-8 border border-blue-100 dark:border-blue-900 z-10">
                                <GraduationCap className="h-10 w-10" />
                            </div>
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-blue-200 to-transparent" />

                            <h3 className="text-2xl font-bold mb-4">2. Book & Learn</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                Schedule 1-on-1 sessions or join group classes. Learn directly from the experts via high-quality video.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center text-blue-600 mb-8 border border-blue-100 dark:border-blue-900 z-10">
                                <Award className="h-9 w-9" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">3. Get Certified</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                Receive valid training certificates and interview prep feedback to ace your next checkride.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section id="features" className="py-24 bg-background">
                <div className="container px-4 mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Popular Training Categories</h2>
                            <p className="text-muted-foreground">From initial training to type ratings.</p>
                        </div>
                        <Button variant="ghost" asChild className="hidden md:inline-flex">
                            <Link href="/classes">View all classes <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {["Interview Prep", "ATPL Theory", "Type Rating Support", "English (ICAO)"].map((cat, i) => (
                            <Link key={i} href={`/classes?category=${cat}`} className="group relative overflow-hidden rounded-xl border bg-card p-8 hover:border-blue-500/50 hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Globe className="h-12 w-12" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{cat}</h3>
                                <p className="text-sm text-muted-foreground mb-6">Find expert instructors for {cat.toLowerCase()}.</p>
                                <div className="flex items-center text-sm font-bold text-blue-600">
                                    Browse <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
                        Instructors set their own rates. We take a small service fee to keep the platform running.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="p-10 rounded-3xl border bg-card hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-4 opacity-80">Students</h3>
                            <div className="text-4xl font-black mb-4">Free</div>
                            <p className="text-muted-foreground font-medium">To join and browse.</p>
                        </div>
                        <div className="p-10 rounded-3xl border-2 border-primary bg-primary/5 shadow-xl relative scale-105 z-10">
                            <div className="absolute top-0 center bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-b-xl shadow-sm left-1/2 -translate-x-1/2">
                                MOST POPULAR
                            </div>
                            <h3 className="text-xl font-bold mb-4 mt-2">Instructors</h3>
                            <div className="text-5xl font-black mb-2 text-primary">10%</div>
                            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-6">Service Fee</div>
                            <p className="text-muted-foreground">We only make money when you get bookings.</p>
                        </div>
                        <div className="p-10 rounded-3xl border bg-card hover:shadow-lg transition-all">
                            <h3 className="text-xl font-bold mb-4 opacity-80">Enterprise</h3>
                            <div className="text-4xl font-black mb-4">Custom</div>
                            <p className="text-muted-foreground font-medium">For flight schools.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-blue-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109a33e?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay fixed-bg"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-blue-950/20"></div>
                <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready for takeoff?</h2>
                    <p className="text-xl md:text-2xl opacity-90 mb-12 font-light max-w-2xl mx-auto">
                        Join thousands of student pilots and aviation professionals accelerating their careers today.
                    </p>
                    <div className="flex justify-center">
                        <GetStartedModal size="lg" variant="secondary" className="px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
                            Get Started for Free
                        </GetStartedModal>
                    </div>
                </div>
            </section>
        </div>
    );
}
