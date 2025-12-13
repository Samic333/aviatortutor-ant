import { ComingSoon } from "@/components/ui/coming-soon";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
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
