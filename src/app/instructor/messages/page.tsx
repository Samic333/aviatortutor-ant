import { ComingSoon } from "@/components/ui/coming-soon";

export default function InstructorMessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
                <ComingSoon
                    title="Student Messaging"
                    description="Chat integration between students and instructors is coming in the next update."
                    backLink="/instructor"
                    backText="Back to Dashboard"
                />
            </div>
        </div>
    );
}
