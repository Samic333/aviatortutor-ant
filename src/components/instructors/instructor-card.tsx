import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import { InstructorProfile, User } from "@prisma/client";

interface InstructorCardProps {
    instructor: InstructorProfile & {
        user: User;
    };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card/50 text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 h-full backdrop-blur-sm">
            <div className="p-6 flex flex-col flex-1 relative z-10">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />

                {/* Header Section */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-background/50 bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground shadow-sm">
                            {instructor.user.image ? (
                                <img src={instructor.user.image} alt={instructor.user.name || "Instructor"} className="h-full w-full object-cover" />
                            ) : (
                                <span>{instructor.user.name?.[0]?.toUpperCase() || "?"}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                {instructor.user.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1.5 ">
                                <div className="flex items-center text-amber-500">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <span className="text-sm font-semibold ml-1">{instructor.rating > 0 ? instructor.rating.toFixed(1) : "New"}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">({instructor.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-xl font-bold text-primary">
                            {instructor.hourlyRateDefault ? `$${instructor.hourlyRateDefault}` : <span className="text-sm text-muted-foreground">Varies</span>}
                        </div>
                        {instructor.hourlyRateDefault && <div className="text-[10px] uppercase font-medium text-muted-foreground tracking-wider">/ hour</div>}
                    </div>
                </div>

                {/* Authorities / Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {instructor.authorities.slice(0, 3).map((auth) => (
                        <span key={auth} className="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors bg-secondary/50 text-secondary-foreground">
                            {auth}
                        </span>
                    ))}
                    {instructor.authorities.length > 3 && (
                        <span className="inline-flex items-center rounded-md border border-transparent px-2 py-1 text-xs font-medium text-muted-foreground bg-muted/50">
                            +{instructor.authorities.length - 3}
                        </span>
                    )}
                </div>

                {/* Bio Snippet */}
                <div className="flex-1 text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
                    {instructor.bio || "No bio available."}
                </div>

                {/* Footer Info */}
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-muted-foreground pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{instructor.yearsOfExperience}y exp</span>
                    </div>
                    {instructor.user.country && (
                        <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="max-w-[100px] truncate">{instructor.user.country}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="p-4 pt-0 mt-auto relative z-10">
                <Button className="w-full gap-2 shadow-sm font-medium" variant="default" asChild>
                    <Link href={`/instructor/${instructor.id}`}>
                        View Profile
                    </Link>
                </Button>
            </div>
        </div>
    );
}
