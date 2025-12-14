import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: {
            class: { include: { instructor: { include: { user: true } } } },
            session: true
        }
    });

    if (!booking || booking.studentId !== user.id) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/student/bookings">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Bookings
                    </Link>
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
                        <p className="text-muted-foreground">Reference ID: #{booking.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "outline"} className="text-lg px-4 py-1">
                        {booking.status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Class Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Class Title</p>
                            <p className="font-semibold text-lg">{booking.class.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p className="font-medium">{booking.class.instructor.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium">${booking.price}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Scheduled Time</p>
                            <p className="font-medium text-lg">
                                {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : "TBD"}
                            </p>
                        </div>
                        {booking.session?.zoomJoinUrl && (
                            <div className="pt-2">
                                <Button className="w-full" asChild>
                                    <a href={booking.session.zoomJoinUrl} target="_blank" rel="noopener noreferrer">
                                        Join Meeting
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        )}
                        {!booking.session && booking.status === "CONFIRMED" && (
                            <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                Session details pending instructor confirmation.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment info mock since we don't have separate Payment model yet fully linked? 
                 Actually booking has price. */}
        </div>
    );
}
