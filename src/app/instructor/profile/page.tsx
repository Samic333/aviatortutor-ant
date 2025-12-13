import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your instructor details</p>
                </div>
                <Button asChild>
                    <Link href="/instructor/profile/edit">Edit Profile</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

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
