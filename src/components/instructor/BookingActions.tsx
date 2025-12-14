"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { updateBookingStatus } from "@/app/instructor/bookings/actions";
import { toast } from "sonner";

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (status: "CONFIRMED" | "CANCELLED") => {
        setIsLoading(true);
        const result = await updateBookingStatus(bookingId, status);
        setIsLoading(false);

        if (result.success) {
            toast.success(`Booking ${status.toLowerCase()} successfully`);
        } else {
            toast.error(result.error || "Action failed");
        }
    };

    if (currentStatus !== "PENDING") {
        return null;
    }

    return (
        <div className="flex gap-2 justify-end">
            <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleAction("CONFIRMED")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span className="sr-only">Accept</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAction("CANCELLED")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                <span className="sr-only">Decline</span>
            </Button>
        </div>
    );
}
