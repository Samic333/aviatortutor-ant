import Link from "next/link";
import { AuthSelection } from "@/components/auth/AuthSelection";
import { Plane } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="container relative min-h-screen flex items-center justify-center py-10">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 -z-10" />
            <div className="absolute top-10 left-10 hidden md:block animate-pulse">
                <Plane className="h-12 w-12 text-blue-200/50 rotate-45" />
            </div>

            <div className="w-full max-w-lg">
                <div className="relative glass-card rounded-2xl p-8 shadow-xl">
                    <AuthSelection />

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
