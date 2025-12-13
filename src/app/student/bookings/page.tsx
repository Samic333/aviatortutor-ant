import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { BookingTable } from "@/components/student/BookingTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

export default async function StudentBookingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const allBookings = await prisma.booking.findMany({
        where: { studentId: user.id },
        include: {
            class: { include: { instructor: { include: { user: true } } } },
            session: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const upcoming = allBookings.filter(b => b.status === "CONFIRMED" || b.status === "PENDING");
    const past = allBookings.filter(b => b.status === "COMPLETED");
    const cancelled = allBookings.filter(b => b.status === "CANCELLED" || b.status === "DISPUTED");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-muted-foreground">Manage your sessions and booking history.</p>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                    <TabsTrigger value="past">Past / Completed ({past.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled / Disputed ({cancelled.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="mt-4">
                    <BookingTable bookings={upcoming} />
                </TabsContent>
                <TabsContent value="past" className="mt-4">
                    <BookingTable bookings={past} />
                </TabsContent>
                <TabsContent value="cancelled" className="mt-4">
                    <BookingTable bookings={cancelled} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
