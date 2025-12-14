import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Plane, Calendar } from "lucide-react";
import Link from "next/link";

export default async function InstructorPublicProfile({ params }: { params: { id: string } }) {
    const instructor = await prisma.instructorProfile.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            classes: {
                where: { status: "PUBLISHED" }
            }
        }
    });

    if (!instructor) notFound();

    return (
        <div className="container max-w-5xl py-12 space-y-8">
            <Card>
                <CardHeader className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {instructor.user.image ? (
                            <img src={instructor.user.image} alt={instructor.user.name || "Instructor"} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="text-4xl">?</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">{instructor.user.name}</h1>
                                {instructor.company && <p className="text-lg text-muted-foreground">{instructor.company}</p>}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                                    <Star className="fill-current h-5 w-5" />
                                    <span>{instructor.rating.toFixed(1)}</span>
                                    <span className="text-muted-foreground font-normal text-sm">({instructor.totalReviews} reviews)</span>
                                </div>
                                <div className="font-semibold text-xl">
                                    {instructor.hourlyRateDefault ? `$${instructor.hourlyRateDefault}/hr` : "Rates vary"}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {instructor.user.country && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {instructor.user.country}
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {instructor.yearsOfExperience} Years Exp.
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {instructor.authorities.map(auth => (
                                <Badge key={auth} variant="secondary">{auth}</Badge>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {instructor.bio || "This instructor has not provided a bio yet."}
                    </p>

                    {instructor.aircraftTypes.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Plane className="h-5 w-5" />
                                Aircraft Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {instructor.aircraftTypes.map(type => (
                                    <Badge key={type} variant="outline">{type}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Available Classes</h2>
                {instructor.classes.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground">No classes currently listed.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {instructor.classes.map(cls => (
                            <Card key={cls.id} className="flex flex-col">
                                <CardHeader>
                                    <h3 className="font-bold text-lg line-clamp-1">{cls.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>60 mins</span> {/* Duration not in schema, defaulted */}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {cls.shortDescription || cls.detailedDescription || "No description available."}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="font-bold">
                                            ${cls.fixedPrice ?? cls.pricePerHour ?? "TBD"}
                                        </span>
                                        <Button asChild size="sm">
                                            <Link href={`/classes/${cls.id}`}>Book Now</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
