import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, ChevronLeft } from "lucide-react";

export default async function ClassDetailsPage({ params }: { params: { id: string } }) {
    const cls = await prisma.class.findUnique({
        where: { id: params.id },
        include: {
            instructor: { include: { user: true } }
        }
    });

    if (!cls) notFound();

    return (
        <div className="container py-8 max-w-4xl">
            <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/classes"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Classes</Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{cls.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="outline">{cls.category || "General"}</Badge>
                            <span className="text-sm">•</span>
                            <div className="flex items-center text-sm">
                                <User className="mr-1 h-4 w-4" />
                                {cls.instructor.user.name}
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">{cls.description}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Class Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>Duration: {cls.duration ? `${cls.duration} minutes` : 'Variable'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>Location: {cls.location || 'Online / TBD'}</span>
                            </div>
                            {cls.startDate && (
                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>
                                        Date: {new Date(cls.startDate).toLocaleDateString()}
                                        {cls.startTime && ` at ${cls.startTime}`}
                                    </span>
                                </div>
                            )}
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
                                ${cls.price}
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
