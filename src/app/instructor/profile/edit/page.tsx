import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { InstructorProfileForm } from "@/components/profile/InstructorProfileForm";

export default async function EditInstructorProfilePage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "INSTRUCTOR") redirect("/");

    const profile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-muted-foreground">Update your public instructor information</p>
            </div>

            <InstructorProfileForm initialData={{
                bio: profile?.bio || "",
                yearsExperience: profile?.yearsOfExperience ?? 0,
                hourlyRate: profile?.hourlyRateDefault ?? 0
            }} />
        </div>
    );
}
