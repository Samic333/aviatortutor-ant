import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { ClassStatusToggle } from "@/components/instructor/ClassStatusToggle";

export default async function InstructorClassesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
    });

    if (!instructorProfile) return <div>Instructor profile not found</div>;

    const classes = await prisma.class.findMany({
        where: { instructorId: instructorProfile.id },
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { bookings: true } } }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                    <p className="text-muted-foreground">Manage your curriculum and offerings.</p>
                </div>
                <Button asChild>
                    <Link href="/instructor/classes/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Class
                    </Link>
                </Button>
            </div>

            {classes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">You haven't created any classes yet.</p>
                    <Button variant="outline" asChild>
                        <Link href="/instructor/classes/new">Create your first class</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                        <Card key={cls.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <ClassStatusToggle classId={cls.id} initialStatus={cls.status} />
                                    <span className="font-bold text-sm">
                                        {cls.pricePerHour ? `$${cls.pricePerHour}/hr` : "Free"}
                                    </span>
                                </div>
                                <CardTitle className="mt-2 line-clamp-1">{cls.title}</CardTitle>
                                <CardDescription>
                                    {cls.authority} • {cls.type}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{cls._count.bookings} Bookings</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/classes/${cls.id}`}>
                                        <Eye className="mr-2 h-4 w-4" /> View
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/instructor/classes/${cls.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
