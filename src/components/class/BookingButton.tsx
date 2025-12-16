"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface BookingButtonProps {
    classId: string;
    userId?: string;
    userRole?: string;
    isAvailable: boolean;
    price: number;
}

export function BookingButton({ classId, userId, userRole, isAvailable, price }: BookingButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleBook = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify({ classId }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/?auth=signin");
                    return;
                }
                throw new Error("Booking failed");
            }

            const data = await res.json();

            if (data.id) {
                toast.success("Booking initiated! Redirecting to payment...");
                setIsOpen(false);
                router.push(`/student/bookings/${data.id}/payment`);
            } else {
                throw new Error("No booking ID returned");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAvailable) {
        return <Button disabled className="w-full">Class Unavailable</Button>;
    }

    if (!userId) {
        return (
            <Button className="w-full" asChild>
                <a href={`/?auth=signin&next=/classes/${classId}`}>Log in to Book</a>
            </Button>
        );
    }

    if (userRole !== "STUDENT") {
        return (
            <Button disabled variant="secondary" className="w-full">
                {userRole === "INSTRUCTOR" ? "Instructors cannot book classes" : "Sign in as Student to Book"}
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full size-lg text-lg">Book Now</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Booking</DialogTitle>
                    <DialogDescription>
                        You are about to book this class.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex justify-between font-semibold">
                        <span>Total Price:</span>
                        <span>{price > 0 ? `$${price}` : "Free"}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleBook} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
