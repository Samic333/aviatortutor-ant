"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateStudentProfile } from "@/app/student/profile/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StudentProfileFormProps {
    initialData: {
        goalSummary?: string;
        targetLicense?: string;
    }
}

export function StudentProfileForm({ initialData }: StudentProfileFormProps) {
    const [formData, setFormData] = useState({
        goalSummary: initialData.goalSummary || "",
        targetLicense: initialData.targetLicense || ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateStudentProfile(formData);
        setIsLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully");
            router.refresh();
            setTimeout(() => router.push("/student/profile"), 1000);
        } else {
            toast.error(result.error || "Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="targetLicense">Target License</Label>
                <Input
                    id="targetLicense"
                    value={formData.targetLicense}
                    onChange={(e) => setFormData({ ...formData, targetLicense: e.target.value })}
                    placeholder="e.g. PPL, CPL, ATPL"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="goalSummary">Learning Goals</Label>
                <Textarea
                    id="goalSummary"
                    value={formData.goalSummary}
                    onChange={(e) => setFormData({ ...formData, goalSummary: e.target.value })}
                    placeholder="Describe your aviation goals..."
                    className="min-h-[150px]"
                />
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
