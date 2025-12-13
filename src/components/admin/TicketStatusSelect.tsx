"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateTicketStatus } from "@/app/support/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketStatusSelectProps {
    ticketId: string;
    currentStatus: string;
}

export function TicketStatusSelect({ ticketId, currentStatus }: TicketStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleUpdate = async (val: string) => {
        setStatus(val);
        setIsLoading(true);
        // Cast validation because schema might vary
        await updateTicketStatus(ticketId, val as any);
        setIsLoading(false);
        router.refresh();
    };

    return (
        <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Select value={status} onValueChange={handleUpdate} disabled={isLoading}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
