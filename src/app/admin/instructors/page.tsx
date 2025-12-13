import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorActions } from "@/components/admin/instructor-actions";

export default async function AdminInstructorsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [pending, approved] = await Promise.all([
        prisma.instructorProfile.findMany({
            where: { pendingApproval: true },
            include: { user: true },
            orderBy: { user: { createdAt: 'desc' } }
        }),
        prisma.instructorProfile.findMany({
            where: { pendingApproval: false },
            include: { user: true, _count: { select: { classes: true } } },
            orderBy: { user: { createdAt: 'desc' } },
            take: 20
        })
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Instructor Management</h1>
                <p className="text-muted-foreground">Review and manage instructor applications</p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList>
                    <TabsTrigger value="pending">Pending Approval ({pending.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-4">
                    {pending.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                No pending instructor applications
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pending.map((instructor) => (
                                <Card key={instructor.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{instructor.user.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{instructor.user.email}</p>
                                            </div>
                                            <Badge variant="outline">Pending</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="text-sm"><strong>Headline:</strong> {instructor.headline || "N/A"}</p>
                                            <p className="text-sm"><strong>Authorities:</strong> {instructor.authorities.join(", ") || "None"}</p>
                                            <p className="text-sm"><strong>Bio:</strong> {instructor.bio?.substring(0, 150)}...</p>
                                            <div className="flex gap-2 mt-4">
                                                <InstructorActions instructorId={instructor.id} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="approved" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Classes</th>
                                        <th className="px-4 py-3 text-left">Rating</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {approved.map((instructor) => (
                                        <tr key={instructor.id}>
                                            <td className="px-4 py-3 font-medium">{instructor.user.name}</td>
                                            <td className="px-4 py-3">{instructor.user.email}</td>
                                            <td className="px-4 py-3">{instructor._count.classes}</td>
                                            <td className="px-4 py-3">{instructor.rating.toFixed(1)}</td>
                                            <td className="px-4 py-3">
                                                <Button size="sm" variant="ghost">View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
