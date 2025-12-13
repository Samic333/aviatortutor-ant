"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
    airlineId: z.string().optional(),
    company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

interface RegisterFormProps {
    role?: "STUDENT" | "INSTRUCTOR";
    onSuccess?: () => void;
}

export function RegisterForm({ role = "STUDENT", onSuccess }: RegisterFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [airlines, setAirlines] = useState<any[]>([]);

    useEffect(() => {
        if (role === "INSTRUCTOR") {
            fetch("/api/airlines")
                .then(res => res.json())
                .then(data => setAirlines(Array.isArray(data) ? data : []))
                .catch(err => console.error("Failed to load airlines", err));
        }
    }, [role]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: role,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/register", { // Fixed endpoint path
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Auto-SignIn
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Account created, but failed to log in automatically.");
            } else {
                if (onSuccess) {
                    onSuccess();
                } else {
                    window.location.reload();
                }
            }

        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 py-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input id="reg-name" placeholder="John Doe" {...register("name")} />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input id="reg-email" type="email" placeholder="john@example.com" {...register("email")} />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input id="reg-password" type="password" {...register("password")} />
                        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-confirm">Confirm Password</Label>
                        <Input id="reg-confirm" type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                    </div>
                </div>

                {role === "INSTRUCTOR" && (
                    <div className="space-y-4 pt-2 border-t">
                        <Label>Airline / Current Employer</Label>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="reg-airline" className="text-xs text-muted-foreground">Select Airline (Preferred)</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("airlineId")}
                                >
                                    <option value="">Select Airline...</option>
                                    {airlines.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name} ({a.country})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex items-center justify-center">
                                <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-company" className="text-xs text-muted-foreground">Other Company</Label>
                                <Input id="reg-company" placeholder="e.g. Local Flight School" {...register("company")} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : role === "INSTRUCTOR" ? "Submit Application" : "Create Account"}
                    </Button>
                    {role === "INSTRUCTOR" && (
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            * Instructor accounts require approval before creating classes.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
