import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { GetStartedModal } from "@/components/auth/get-started-modal";
import { AuthButtons } from "@/components/layout/AuthButtons";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Plane className="h-6 w-6 text-primary rotate-[-45deg]" />
                    <span className="text-xl font-bold tracking-tight">AviatorTutor</span>
                </Link>

                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
                    <Link href="/#instructors-section" className="hover:text-primary transition-colors">Find Instructor</Link>
                    <Link href="/#classes-section" className="hover:text-primary transition-colors">Browse Classes</Link>
                    <Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <AuthButtons />
                    <GetStartedModal size="sm">
                        Get Started
                    </GetStartedModal>
                </div>
            </div>
        </header>
    );
}
