"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Suspense } from "react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: credentials.email,
                password: credentials.password,
            });

            if (res?.error) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Signed in successfully");

                // Get the updated session to check the role
                const session = await getSession();

                if (session?.user) {
                    const role = session.user.role;
                    switch (role) {
                        case "STUDENT":
                            router.push("/student");
                            break;
                        case "INSTRUCTOR":
                            router.push("/instructor");
                            break;
                        case "ADMIN":
                            router.push("/admin");
                            break;
                        case "SUPER_ADMIN":
                            router.push("/super-admin");
                            break;
                        case "OWNER":
                            router.push("/owner");
                            break;
                        default:
                            router.push("/");
                    }
                    router.refresh();
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative min-h-screen flex items-center justify-center py-10">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 -z-10" />

            <div className="w-full max-w-md">
                <div className="glass-card rounded-2xl p-8 shadow-xl">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {searchParams?.get("error") && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md mb-4 flex items-center gap-2 border border-red-200 dark:border-red-900">
                            <p>{searchParams.get("error") === "Callback" ? "Authentication provider error." : "Authentication failed. Please check your credentials."}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input className="bg-background/50" id="email" type="email" placeholder="name@example.com" value={credentials.email} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input className="bg-background/50" id="password" type="password" value={credentials.password} onChange={handleChange} required />
                        </div>
                        <Button className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SignInContent />
        </Suspense>
    );
}

