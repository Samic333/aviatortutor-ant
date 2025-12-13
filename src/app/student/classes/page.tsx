import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentClassesPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    // Bookings that are confirmed (Enrolled classes)
    const bookings = await prisma.booking.findMany({
        where: {
            studentId: user.id,
            status: "CONFIRMED"
        },
        include: {
            class: {
                include: { instructor: { include: { user: true } } }
            }
        }
    });

    const bookedClassIds = bookings.map(b => b.classId);

    // Suggested Classes (Not booked)
    const suggestedClasses = await prisma.class.findMany({
        where: {
            status: "PUBLISHED",
            id: { notIn: bookedClassIds }
        },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { instructor: { include: { user: true } } }
    });

    return (
        <div className="space-y-10">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
                    <p className="text-muted-foreground">Manage your enrolled courses and upcoming sessions.</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card">
                        <h3 className="text-lg font-medium">No classes yet</h3>
                        <p className="text-muted-foreground mb-4">Start your training journey today.</p>
                        <Button asChild>
                            <Link href="/student/browse-instructors">Find an Instructor</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge>{booking.class.type}</Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-2 line-clamp-1">{booking.class.title}</CardTitle>
                                    <CardDescription>with {booking.class.instructor.user.name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-sm font-medium">Status: {booking.status}</span>
                                        <Button size="sm" variant="secondary" asChild>
                                            <Link href={`/classes/${booking.classId}`}>View Class</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Suggested Section */}
            {suggestedClasses.length > 0 && (
                <div className="space-y-6 pt-6 border-t">
                    <h3 className="text-2xl font-bold tracking-tight">Suggested Classes</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {suggestedClasses.map((cls) => (
                            <Card key={cls.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline">{cls.authority || "General"}</Badge>
                                        <span className="font-bold text-sm">
                                            {cls.pricePerHour ? `$${cls.pricePerHour}/hr` : `$${cls.fixedPrice}`}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-2 line-clamp-1">{cls.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{cls.shortDescription || "No description."}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                            {cls.instructor.user.name?.[0]}
                                        </div>
                                        <span>{cls.instructor.user.name}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" asChild>
                                        <Link href={`/classes/${cls.id}`}>View Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

