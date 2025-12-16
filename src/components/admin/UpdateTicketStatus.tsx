"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateTicketStatus } from "@/app/support/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function UpdateTicketStatus({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        setIsLoading(true);
        const result = await updateTicketStatus(ticketId, newStatus as any);
        setIsLoading(false);

        if (result.success) {
            setStatus(newStatus);
            toast.success("Status updated");
        } else {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleUpdate} disabled={isLoading}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
            </Select>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
    );
}
