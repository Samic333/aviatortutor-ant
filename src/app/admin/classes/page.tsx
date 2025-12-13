import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminClassesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const classes = await prisma.class.findMany({
        include: {
            instructor: { include: { user: true } },
            _count: { select: { bookings: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
                <p className="text-muted-foreground">Monitor and moderate all classes</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Instructor</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Type</th>
                                    <th className="px-4 py-3 text-left">Bookings</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {classes.map((cls) => (
                                    <tr key={cls.id}>
                                        <td className="px-4 py-3 font-medium max-w-xs truncate">{cls.title}</td>
                                        <td className="px-4 py-3">{cls.instructor.user.name}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={cls.status === "PUBLISHED" ? "default" : "secondary"}>
                                                {cls.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">{cls.type}</td>
                                        <td className="px-4 py-3">{cls._count.bookings}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" asChild>
                                                    <Link href={`/classes/${cls.id}`}>View</Link>
                                                </Button>
                                                {cls.status === "PUBLISHED" && (
                                                    <Button size="sm" variant="destructive">Suspend</Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
