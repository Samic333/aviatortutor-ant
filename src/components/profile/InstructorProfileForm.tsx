"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateInstructorProfile } from "@/app/instructor/profile/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InstructorProfileFormProps {
    initialData: {
        bio?: string;
        yearsExperience?: number;
        hourlyRate?: number;
    }
}

export function InstructorProfileForm({ initialData }: InstructorProfileFormProps) {
    const [formData, setFormData] = useState({
        bio: initialData.bio || "",
        yearsExperience: initialData.yearsExperience || 0,
        hourlyRate: initialData.hourlyRate || 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateInstructorProfile(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully");
            router.refresh();
            setTimeout(() => router.push("/instructor/profile"), 1000);
        } else {
            toast.error(result.error || "Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="bio">Bio / Professional Summary</Label>
                <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell students about your experience..."
                    required
                    className="min-h-[150px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="years">Years of Experience</Label>
                    <Input
                        id="years"
                        type="number"
                        min="0"
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate ($)</Label>
                    <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
        </form>
    );
}
