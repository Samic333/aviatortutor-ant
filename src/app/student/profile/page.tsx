import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ComingSoon } from "@/components/ui/coming-soon";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
                    <p className="text-muted-foreground">Manage your student details</p>
                </div>
                <Button asChild>
                    <Link href="/student/profile/edit">Edit Profile</Link>
                </Button>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
                <ComingSoon
                    title="Profile Management"
                    description="You will soon be able to manage your profile details, password, and preferences."
                    backLink="/student"
                    backText="Back to Dashboard"
                />
            </div>
        </div>
    );
}
