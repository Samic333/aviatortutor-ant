"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-center">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                        <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
                        <p className="text-gray-600 mb-6">
                            We've encountered a critical error. Please try refreshing the page or sign out to reset your session.
                        </p>

                        {error.digest && (
                            <p className="text-xs text-gray-400 mb-6 font-mono">
                                Error ID: {error.digest}
                            </p>
                        )}

                        <div className="space-y-3">
                            <Button onClick={() => reset()} className="w-full">
                                Try again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out & Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
