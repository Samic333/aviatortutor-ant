"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function InstructorSignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        yearsOfExperience: "",
        bio: "",
        primaryAuthority: "",
        country: "",
        timezone: "",
        company: "",
        aircraftTypes: "",
        languages: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    role: "INSTRUCTOR",
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    yearsOfExperience: formData.yearsOfExperience,
                    bio: formData.bio,
                    authorities: formData.primaryAuthority ? [formData.primaryAuthority] : [],
                    country: formData.country,
                    timezone: formData.timezone,
                    company: formData.company,
                    aircraftTypes: formData.aircraftTypes.split(",").map(s => s.trim()).filter(Boolean),
                    languages: formData.languages.split(",").map(s => s.trim()).filter(Boolean),
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
                toast.success("Application submitted!");
                router.push("/instructor");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" className="-ml-2 h-8 px-2" asChild>
                        <Link href="/auth/signup"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
                    </Button>
                </div>
                <CardTitle className="text-2xl font-bold">Instructor Application</CardTitle>
                <CardDescription>
                    Apply to join our network of professional flight instructors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Captain Jane Doe" required value={formData.name} onChange={handleChange} />
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
                            <Label htmlFor="yearsOfExperience">Years Exp.</Label>
                            <Input id="yearsOfExperience" type="number" placeholder="5" required value={formData.yearsOfExperience} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Primary Authority</Label>
                            <Select onValueChange={(val) => handleSelectChange("primaryAuthority", val)}>
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
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company">Current/Previous Company (Optional)</Label>
                            <Input id="company" placeholder="e.g. Delta Air Lines" value={formData.company} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="aircraftTypes">Aircraft Types (comma separated)</Label>
                            <Input id="aircraftTypes" placeholder="A320, B737, C172" required value={formData.aircraftTypes} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="languages">Languages (comma separated)</Label>
                            <Input id="languages" placeholder="English, Spanish" required value={formData.languages} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio">Short Bio / Qualifications</Label>
                        <Textarea
                            id="bio"
                            placeholder="Briefly describe your flight experience and what you teach (e.g. CFI, CFII, MEI, airline checks)..."
                            className="h-24"
                            required
                            value={formData.bio}
                            onChange={handleChange}
                        />
                    </div>

                    <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
                    </Button>
                </form>
            </CardContent>
        </Card >
    );
}
