import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, BookOpen, Users, Star, Plus, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { CompleteProfileBanner } from "@/components/shared/CompleteProfileBanner";

export default async function InstructorDashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    // Fetch Instructor Profile
    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
        include: {
            classes: true
        }
    });

    if (!instructorProfile) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Become an Instructor</h1>
                <p className="max-w-md text-muted-foreground mb-6">
                    You haven't set up your instructor profile yet. Please complete your profile to start creating classes.
                </p>
                <Button asChild>
                    <Link href="/instructor/profile">Create Profile</Link>
                </Button>
            </div>
        );
    }

    if (instructorProfile.pendingApproval) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-full mb-6">
                    <Star className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Application Under Review</h2>
                <p className="text-muted-foreground max-w-md mb-8 text-lg">
                    Your instructor application is currently being reviewed by our team. We'll notify you once you're approved to teach.
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/instructor/profile">View Profile</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/instructor/support">Contact Support</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Stats
    const totalEarnings = 0; // TODO: Calculate from bookings
    const upcomingSessionsResult = await prisma.booking.findMany({
        where: {
            class: { instructorId: instructorProfile.id },
            status: "CONFIRMED"
        },
        include: { class: true, student: true },
        orderBy: { scheduledTime: 'asc' },
        take: 5
    });

    const uniqueStudents = await prisma.booking.groupBy({
        by: ['studentId'],
        where: { class: { instructorId: instructorProfile.id } }
    });

    const rating = instructorProfile.rating || 0;
    const isProfileComplete = !!(instructorProfile.bio && instructorProfile.yearsOfExperience && instructorProfile.hourlyRateDefault);

    return (
        <div className="space-y-8">
            {!isProfileComplete && <CompleteProfileBanner role="INSTRUCTOR" />}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/instructor/classes/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Class
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalEarnings}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingSessionsResult.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueStudents.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">
                            {instructorProfile.totalReviews} reviews
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    {upcomingSessionsResult.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-primary/10 p-4 rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">No Upcoming Sessions</h3>
                            <p className="text-muted-foreground max-w-sm">
                                You don't have any sessions scheduled currently.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingSessionsResult.map(booking => (
                                <div key={booking.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{booking.class.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            with {booking.student.name} • {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleString() : "Date TBD"}
                                        </p>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/instructor/bookings`}>View</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
