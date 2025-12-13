import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StudentProfileForm } from "@/components/profile/StudentProfileForm";

export default async function EditStudentProfilePage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") redirect("/");

    const profile = await prisma.studentProfile.findUnique({
        where: { userId: user.id }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-muted-foreground">Update your learning goals</p>
            </div>

            <StudentProfileForm initialData={{
                goalSummary: profile?.goalSummary || "",
                targetLicense: profile?.targetLicense || ""
            }} />
        </div>
    );
}
