import Link from "next/link";
import { Plane } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
            <Link href="/" className="flex items-center space-x-2 mb-8">
                <Plane className="h-8 w-8 text-primary rotate-[-45deg]" />
                <span className="text-2xl font-bold tracking-tight">AviatorTutor</span>
            </Link>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
