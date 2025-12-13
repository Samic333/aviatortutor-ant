import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Award, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileCompletenessCard } from "@/components/student/ProfileCompletenessCard";
import { Badge } from "@/components/ui/badge";

export default async function StudentDashboard() {
    const user = await getCurrentUser();
    if (!user) return null;

    // Fetch data in parallel
    const [
        completedClasses,
        upcomingBookings,
        studentProfile,
        recommendedClasses,
        extendedUser
    ] = await Promise.all([
        prisma.booking.count({
            where: { studentId: user.id, status: "COMPLETED" }
        }),
        prisma.booking.findMany({
            where: {
                studentId: user.id,
                status: "CONFIRMED",
                // For real usage, uncomment:
                // scheduledTime: { gte: new Date() } 
            },
            take: 5,
            include: {
                class: { include: { instructor: { include: { user: true } } } },
                session: true
            },
            orderBy: { scheduledTime: 'asc' }
        }),
        prisma.studentProfile.findUnique({
            where: { userId: user.id }
        }),
        prisma.class.findMany({
            where: { status: "PUBLISHED" },
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: { instructor: { include: { user: true } } }
        }),
        prisma.user.findUnique({
            where: { id: user.id }
        })
    ]);

    // Calculate Profile Completeness
    let score = 0;
    const missing: string[] = [];
    const dbUser = extendedUser || user; // Fallback to session user if db fetch fails (unlikely)

    if (dbUser.name) score += 10; else missing.push("Name");
    if (dbUser.image) score += 20; else missing.push("Profile Photo");
    // Cast to any if needed or ensure dbUser type has these fields (it should from Prisma)
    if ((dbUser as any).country) score += 10; else missing.push("Country");
    if ((dbUser as any).timezone) score += 10; else missing.push("Timezone");
    if (studentProfile?.targetLicense) score += 20; else missing.push("Target License");
    if (studentProfile?.goalSummary) score += 20; else missing.push("Goal Summary");
    if (dbUser.email) score += 10;

    // Cap at 100
    if (score > 100) score = 100;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, {user.name || "Student"}.</p>
                </div>
                <Button asChild>
                    <Link href="/instructors">Find a Class</Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Classes</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedClasses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <ProfileCompletenessCard completeness={score} missingFields={missing} />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground mb-2">No upcoming sessions scheduled.</p>
                                <Button variant="link" asChild className="p-0">
                                    <Link href="/instructors">Book starting now</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map(booking => (
                                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-gray-50/50">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                                            {booking.class.instructor.user.name?.[0] || "I"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{booking.class.title}</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>with {booking.class.instructor.user.name}</span>
                                                <span>•</span>
                                                <span>{booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString() : "Date TBD"}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {booking.session?.zoomJoinUrl ? (
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                                                    <a href={booking.session.zoomJoinUrl} target="_blank" rel="noreferrer">Join Zoom</a>
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/student/bookings/${booking.id}`}>Details</Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recommended</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendedClasses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recommendations available at the moment.</p>
                        ) : (
                            recommendedClasses.map(cls => (
                                <Link key={cls.id} href={`/classes/${cls.id}`} className="block group">
                                    <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors">
                                        <div className="h-10 w-10 bg-gray-200 rounded-md flex-shrink-0" /> {/* Placeholder for class image if any */}
                                        <div>
                                            <p className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">{cls.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1 py-0">{cls.authority || "General"}</Badge>
                                                <span className="text-xs text-muted-foreground">{cls.pricePerHour ? `$${cls.pricePerHour}/hr` : "Fixed"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                        <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                            <Link href="/instructors">View all available classes</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}

