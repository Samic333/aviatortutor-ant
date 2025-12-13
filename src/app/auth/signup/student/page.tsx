"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed, if not we'll use window.alert for now or generic toast

export default function StudentSignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        targetLicense: "",
        authority: "",
        country: "",
        timezone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: "STUDENT",
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    targetLicense: formData.targetLicense,
                    authoritiesOfInterest: formData.authority ? [formData.authority] : [],
                    country: formData.country,
                    timezone: formData.timezone,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Auto sign in
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result?.error) {
                toast.error("Account created, but failed to log in automatically.");
                router.push("/auth/signin");
            } else {
                toast.success("Welcome aboard!");
                router.push("/student");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" className="-ml-2 h-8 px-2" asChild>
                        <Link href="/auth/signup"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
                    </Button>
                </div>
                <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
                <CardDescription>
                    Create your account to start your aviation journey.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" placeholder="e.g. USA" required value={formData.country} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Input id="timezone" placeholder="e.g. EST" required value={formData.timezone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Authority</Label>
                            <Select onValueChange={(val) => handleSelectChange("authority", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FAA">FAA (USA)</SelectItem>
                                    <SelectItem value="EASA">EASA (Europe)</SelectItem>
                                    <SelectItem value="CAA">CAA (UK)</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Target License</Label>
                            <Select onValueChange={(val) => handleSelectChange("targetLicense", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PPL">PPL</SelectItem>
                                    <SelectItem value="IR">Instrument Rating</SelectItem>
                                    <SelectItem value="CPL">CPL</SelectItem>
                                    <SelectItem value="ATPL">ATPL</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
