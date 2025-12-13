"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveInstructor } from "@/app/admin/instructors/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface InstructorActionsProps {
    instructorId: string;
}

export function InstructorActions({ instructorId }: InstructorActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveInstructor(instructorId);
            if (result.success) {
                toast.success("Instructor approved");
            } else {
                toast.error("Failed to approve instructor");
            }
        });
    };

    return (
        <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleApprove} disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
            </Button>
            <Button size="sm" variant="destructive" disabled>
                Reject
            </Button>
        </div>
    );
}
