import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BookingSuccessPage({ searchParams }: { searchParams: { bookingId: string } }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                Your payment was successful and your spot has been reserved.
                {searchParams.bookingId && <span className="block mt-2 text-sm">Booking ID: {searchParams.bookingId}</span>}
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/student/bookings">View My Bookings</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/classes">Book Another Class</Link>
                </Button>
            </div>
        </div>
    );
}
