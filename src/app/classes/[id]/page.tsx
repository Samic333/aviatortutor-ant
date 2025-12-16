import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/session";

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
    const cls = await prisma.class.findUnique({
        where: { id: params.id },
        include: {
            instructor: { include: { user: true } }
        }
    });

    if (!cls) notFound();

    const user = await getCurrentUser();

    let backLink = "/classes";
    let backLabel = "Back to Classes";

    if (user) {
        if (user.role === "STUDENT") {
            backLink = "/student/browse-instructors";
            backLabel = "Back to Browse";
        } else if (user.role === "INSTRUCTOR") {
            backLink = "/instructor/classes";
            backLabel = "Back to My Classes";
        } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "OWNER") {
            backLink = "/admin/classes";
            backLabel = "Back to Admin Classes";
        }
    }

    return (
        <div className="container py-8 max-w-4xl">
            <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href={backLink}><ChevronLeft className="mr-2 h-4 w-4" /> {backLabel}</Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{cls.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="outline">{cls.type.replace(/_/g, " ")}</Badge>
                            <span className="text-sm">•</span>
                            <div className="flex items-center text-sm">
                                <User className="mr-1 h-4 w-4" />
                                {cls.instructor.user.name}
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">
                            {cls.detailedDescription || cls.shortDescription || "No description provided."}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Class Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>Duration: 60 minutes (Est.)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>Location: Online</span>
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>Schedule: Select a time during booking</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                            <CardDescription>Reserve your spot today</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-3xl font-bold text-center">
                                ${cls.fixedPrice ?? cls.pricePerHour ?? 0}
                            </div>

                            <Button className="w-full" size="lg" asChild>
                                <Link href={`/classes/${cls.id}/book`}>Book Now</Link>
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Secure payment via Stripe or Flutterwave
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
