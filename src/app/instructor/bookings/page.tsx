import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default async function InstructorBookingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
    });

    if (!instructorProfile) return <div>Profile not found</div>;

    const bookings = await prisma.booking.findMany({
        where: { class: { instructorId: instructorProfile.id } },
        include: {
            class: true,
            student: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                <p className="text-muted-foreground">Manage student enrollments and sessions.</p>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">All Bookings</h2>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <p className="text-muted-foreground">No bookings yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 font-medium border-b">
                                    <tr>
                                        <th className="px-4 py-3">Student</th>
                                        <th className="px-4 py-3">Class</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="px-4 py-3 font-medium">{booking.student.name}</td>
                                            <td className="px-4 py-3">{booking.class.title}</td>
                                            <td className="px-4 py-3">
                                                {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : "Unscheduled"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline">{booking.paymentStatus}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
