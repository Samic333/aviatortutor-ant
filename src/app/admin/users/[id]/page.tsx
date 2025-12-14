import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, Mail, Shield, Calendar } from "lucide-react";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        redirect("/");
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            instructorProfile: true,
            studentProfile: true,
            _count: {
                select: {
                    bookings: true
                }
            }
        }
    });

    if (!targetUser) notFound();

    // Fetch some recent audit logs
    const logs = await prisma.auditLog.findMany({
        where: { actorId: targetUser.id },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8">
            <Button variant="ghost" asChild className="mb-4 pl-0">
                <Link href="/admin/users">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Link>
            </Button>

            <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500">
                    {targetUser.image ? (
                        <img src={targetUser.image} alt={targetUser.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-10 w-10" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{targetUser.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{targetUser.email}</span>
                    </div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {targetUser.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        Joined {new Date(targetUser.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-xs">{targetUser.id}</span>

                            <span className="text-muted-foreground">Country:</span>
                            <span>{targetUser.country || "N/A"}</span>

                            <span className="text-muted-foreground">Timezone:</span>
                            <span>{targetUser.timezone || "N/A"}</span>

                            {/* Properties not in current User schema
                             <span className="text-muted-foreground">Phone:</span>
                             <span>{targetUser.phoneNumber || "N/A"}</span>
                             */}
                        </div>
                    </CardContent>
                </Card>

                {targetUser.instructorProfile && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructor Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Company:</span>
                                <span>{targetUser.instructorProfile.company || "N/A"}</span>

                                <span className="text-muted-foreground">Hourly Rate:</span>
                                <span>{targetUser.instructorProfile.hourlyRateDefault ? `$${targetUser.instructorProfile.hourlyRateDefault}` : "N/A"}</span>

                                <span className="text-muted-foreground">Rating:</span>
                                <span>{targetUser.instructorProfile.rating.toFixed(1)} ({targetUser.instructorProfile.totalReviews} reviews)</span>

                                <span className="text-muted-foreground">Approved:</span>
                                <Badge variant={targetUser.instructorProfile.pendingApproval ? "destructive" : "default"}>
                                    {targetUser.instructorProfile.pendingApproval ? "Pending" : "Active"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity (Audit Logs)</CardTitle>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No activity recorded.</p>
                    ) : (
                        <div className="space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{log.action}</span>
                                        <span className="text-xs text-muted-foreground">{log.entityType} • {log.status}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
