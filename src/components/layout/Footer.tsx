import Link from "next/link";
import { Plane } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Plane className="h-6 w-6 text-primary rotate-[-45deg]" />
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for aviation professionals. &copy; {new Date().getFullYear()} AviatorTutor.
                    </p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                    <Link href="/" className="hover:underline underline-offset-4">Home</Link>
                    <Link href="/support" className="hover:underline underline-offset-4">Support</Link>
                    <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
