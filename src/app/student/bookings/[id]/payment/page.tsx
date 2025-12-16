"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { processMockPayment } from "@/actions/payment";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BookingPaymentPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const result = await processMockPayment(params.id);
            if (result.success) {
                setIsSuccess(true);
                toast.success("Payment successful! Booking confirmed.");
                setTimeout(() => {
                    router.push("/student/bookings");
                }, 2000);
            } else {
                toast.error(result.error || "Payment failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3 text-green-600">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                        <CardDescription>
                            Your booking has been confirmed. Redirecting you to your bookings...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-lg py-20">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Your Booking</CardTitle>
                    <CardDescription>
                        Please review your booking details and proceed to payment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Booking ID</span>
                            <span className="font-mono text-sm">{params.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between font-medium text-lg">
                            <span>Total Amount</span>
                            <span>$mock_price</span> {/* Ideally fetch booking details here if needed, but for speed we rely on server action validation */}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                            * This is a temporary payment flow. No actual charge will be made.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Proceed to Checkout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
