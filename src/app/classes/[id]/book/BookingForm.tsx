"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookingAndCheckout } from "./actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingFormProps {
    classId: string;
    price: number;
}

export function BookingForm({ classId, price }: BookingFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                const result = await createBookingAndCheckout(formData);
                if (result?.error) {
                    toast.error(result.error);
                }
                // If success, the server action calls redirect() which Next.js handles.
                // We don't need explicit success handling here unless redirect fails.
            } catch (error) {
                console.error("Booking error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            }
        });
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="classId" value={classId} />

            <div className="space-y-2 mb-4">
                <Label htmlFor="scheduledTime">Requested Date & Time</Label>
                <Input
                    type="datetime-local"
                    name="scheduledTime"
                    id="scheduledTime"
                    required
                    className="w-full"
                />
            </div>

            <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                    <span>Total</span>
                    <span className="font-bold text-xl">${price}</span>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Proceed to Payment"
                    )}
                </Button>
            </div>
        </form>
    );
}
