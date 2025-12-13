import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { InstructorSearch } from "@/components/student/InstructorSearch";
import { User, Shield, Star, Plane } from "lucide-react";

export default async function BrowseInstructorsPage({
    searchParams
}: {
    searchParams: { q?: string; authority?: string }
}) {
    const user = await getCurrentUser();
    // Allow standard browsing even if not logged in? 
    // Layout guards protect this route, so user is logged in.

    const query = searchParams.q;
    const authority = searchParams.authority;

    const instructors = await prisma.instructorProfile.findMany({
        where: {
            pendingApproval: false,
            ...(authority ? { authorities: { has: authority } } : {}),
            ...(query ? {
                OR: [
                    { user: { name: { contains: query, mode: 'insensitive' } } },
                    { bio: { contains: query, mode: 'insensitive' } }
                    // Simple search
                ]
            } : {})
        },
        include: { user: true },
        take: 20
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Browse Instructors</h1>
                <p className="text-muted-foreground">Find the perfect mentor for your aviation journey.</p>
            </div>

            <InstructorSearch />

            {instructors.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No instructors found matching your criteria.</p>
                    <Link href="/student/browse-instructors" className="text-blue-600 hover:underline">Clear filters</Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {instructors.map((instructor) => (
                        <Card key={instructor.id} className="flex flex-col">
                            <CardHeader className="flex flex-row gap-4 items-start pb-2">
                                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {instructor.user.image ? (
                                        <img src={instructor.user.image} alt={instructor.user.name || "Instructor"} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-700">
                                            <User className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{instructor.user.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span>{instructor.rating > 0 ? instructor.rating.toFixed(1) : "New"}</span>
                                        <span className="text-muted-foreground font-normal">({instructor.totalReviews})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {instructor.authorities.slice(0, 3).map(auth => (
                                            <Badge key={auth} variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">{auth}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {instructor.bio || "No bio available."}
                                </p>
                                <div className="space-y-1">
                                    {instructor.aircraftTypes.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Plane className="h-3 w-3" />
                                            <span className="truncate max-w-[200px]">{instructor.aircraftTypes.slice(0, 3).join(", ")}</span>
                                        </div>
                                    )}
                                    <div className="font-semibold text-sm">
                                        {instructor.hourlyRateDefault ? `$${instructor.hourlyRateDefault}/hr` : "Varies"}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Button variant="outline" asChild>
                                        <Link href={`/instructors/${instructor.id}`}>View Profile</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={`/classes?instructorId=${instructor.id}`}>Book Now</Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
