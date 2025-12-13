import { ClassForm } from "@/components/instructor/ClassForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assumption: authOptions location
import prisma from "@/lib/prisma";
import { Stub } from "@/components/ui/stub";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";

export default async function NewClassPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <div>Access Denied</div>;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { instructorProfile: true },
    });

    if (!user || user.role !== "INSTRUCTOR" || !user.instructorProfile) {
        return <div>Access Denied</div>;
    }

    if (user.instructorProfile.pendingApproval) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Account Pending Approval</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Thanks for applying! Your instructor account is currently under review.
                        You will be able to create classes once our team approves your profile.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/instructor/dashboard">Back to Dashboard</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/support">Contact Support</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
                <p className="text-muted-foreground">Set up a new learning opportunity for students.</p>
            </div>
            <ClassForm />
        </div>
    );
}
