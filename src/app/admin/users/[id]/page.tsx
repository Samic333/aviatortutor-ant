import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default async function AdminUserDetailsPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER") {
        redirect("/");
    }

    const userData = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            instructorProfile: true,
            studentProfile: true,
            bookings: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { class: true }
            }
        }
    });

    if (!userData) return <div>User not found</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" asChild>
                <Link href="/admin/users"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Users</Link>
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{userData.name || "Unnamed User"}</h1>
                    <p className="text-muted-foreground">{userData.email}</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1">{userData.role}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div><span className="font-semibold">Joined:</span> {new Date(userData.createdAt).toLocaleDateString()}</div>
                        <div><span className="font-semibold">Country:</span> {userData.country || "N/A"}</div>
                        <div><span className="font-semibold">Timezone:</span> {userData.timezone || "N/A"}</div>

                        {userData.instructorProfile && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold mb-2">Instructor Profile</h4>
                                <div>Status: <Badge>{userData.instructorProfile.pendingApproval ? "Pending" : "Approved"}</Badge></div>
                                <div>Bio: {userData.instructorProfile.bio?.substring(0, 100)}...</div>
                            </div>
                        )}

                        {userData.studentProfile && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold mb-2">Student Profile</h4>
                                <div>Goal: {userData.studentProfile.targetLicense || "N/A"}</div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userData.bookings.length > 0 ? (
                            <ul className="space-y-2">
                                {userData.bookings.map(b => (
                                    <li key={b.id} className="text-sm border-b pb-2">
                                        Booked <strong>{b.class.title}</strong> on {new Date(b.createdAt).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No recent bookings.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
