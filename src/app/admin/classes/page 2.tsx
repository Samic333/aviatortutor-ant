import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, BookOpen, Eye } from "lucide-react";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

async function approveClass(classId: string) {
    "use server";
    await prisma.class.update({
        where: { id: classId },
        data: { status: "PUBLISHED" }
    });
    revalidatePath("/admin/classes");
}

async function rejectClass(classId: string) {
    "use server";
    await prisma.class.update({
        where: { id: classId },
        data: { status: "DRAFT" }
    });
    revalidatePath("/admin/classes");
}

export default async function AdminClassesPage() {
    const classes = await prisma.class.findMany({
        include: {
            instructor: { include: { user: { select: { name: true } } } },
            _count: { select: { bookings: true } }
        },
        orderBy: [
            { status: "asc" },
            { createdAt: "desc" }
        ]
    });

    const pendingClasses = classes.filter(c => c.status === "PENDING_REVIEW");
    const publishedClasses = classes.filter(c => c.status === "PUBLISHED");
    const draftClasses = classes.filter(c => c.status === "DRAFT");

    const statusColors = {
        PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
        PUBLISHED: "bg-green-100 text-green-700",
        DRAFT: "bg-gray-100 text-gray-600",
        ARCHIVED: "bg-red-100 text-red-600"
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
                    <p className="text-muted-foreground">Manage class approvals and listings</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{classes.length}</div>
                        <p className="text-sm text-muted-foreground">Total Classes</p>
                    </CardContent>
                </Card>
                <Card className="border-yellow-200">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">{pendingClasses.length}</div>
                        <p className="text-sm text-yellow-600">Pending Review</p>
                    </CardContent>
                </Card>
                <Card className="border-green-200">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{publishedClasses.length}</div>
                        <p className="text-sm text-green-600">Published</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gray-400">{draftClasses.length}</div>
                        <p className="text-sm text-muted-foreground">Drafts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Reviews */}
            {pendingClasses.length > 0 && (
                <Card className="border-yellow-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700">
                            <Clock className="h-5 w-5" />
                            Pending Review ({pendingClasses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pendingClasses.map(cls => (
                            <div key={cls.id} className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                <div>
                                    <p className="font-semibold">{cls.title}</p>
                                    <p className="text-sm text-muted-foreground">by {cls.instructor.user.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Type: {cls.type} | Price: ${cls.fixedPrice || cls.pricePerHour || 0}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/classes/${cls.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <form action={approveClass.bind(null, cls.id)}>
                                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                    </form>
                                    <form action={rejectClass.bind(null, cls.id)}>
                                        <Button type="submit" size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* All Classes Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Title</th>
                                    <th className="px-4 py-3 text-left font-medium">Instructor</th>
                                    <th className="px-4 py-3 text-left font-medium">Type</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                    <th className="px-4 py-3 text-left font-medium">Bookings</th>
                                    <th className="px-4 py-3 text-left font-medium">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map(cls => (
                                    <tr key={cls.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">{cls.title}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{cls.instructor.user.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                                                {cls.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-1 rounded ${statusColors[cls.status]}`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{cls._count.bookings}</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {format(new Date(cls.createdAt), "MMM d, yyyy")}
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
