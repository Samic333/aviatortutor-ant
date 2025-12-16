import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage({ searchParams }: { searchParams: { bookingId: string } }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
            <div className="bg-green-100 p-6 rounded-full mb-6 text-green-600">
                <CheckCircle className="h-16 w-16" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Your booking has been confirmed. You will receive a confirmation email shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                    <Link href={`/student/bookings/${searchParams.bookingId}`}>View Booking Details</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/student/bookings">My Bookings</Link>
                </Button>
            </div>
        </div>
    );
}
