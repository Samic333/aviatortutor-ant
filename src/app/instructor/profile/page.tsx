import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Using HTML textarea in real usage if component missing

export default async function InstructorProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const profile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
    });

    // In a real app, this would be a Client Component using react-hook-form to update.
    // For now, displaying read-only or basic structure.

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Instructor Profile</h1>
                <p className="text-muted-foreground">Manage your public profile information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Headline</label>
                        <Input defaultValue={profile?.headline || ""} placeholder="e.g. A320 Captain & Instructor" disabled />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Bio</label>
                        <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={profile?.bio || ""}
                            disabled
                        />
                    </div>
                    <Button variant="outline">Edit Profile (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
    );
}
