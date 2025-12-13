
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Star } from "lucide-react";

interface ClassCardProps {
    id: string;
    title: string;
    instructorName: string;
    authority: string | null;
    pricePerHour: number | null;
    fixedPrice: number | null;
    type: string;
    bookingCount?: number;
    description?: string | null;
}

export function ClassCard({
    id,
    title,
    instructorName,
    authority,
    pricePerHour,
    fixedPrice,
    type,
    bookingCount = 0,
    description
}: ClassCardProps) {
    const priceDisplay = fixedPrice
        ? `$${fixedPrice}`
        : pricePerHour
            ? `$${pricePerHour}/hr`
            : "Contact for Price";

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <Badge variant="outline" className="mb-2">
                            {type.replace(/_/g, " ")}
                        </Badge>
                        <CardTitle className="text-xl line-clamp-2 leading-tight">
                            <Link href={`/classes/${id}`} className="hover:underline">
                                {title}
                            </Link>
                        </CardTitle>
                    </div>
                    {authority && (
                        <Badge variant="secondary" className="shrink-0">
                            {authority}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    by <span className="font-medium text-foreground">{instructorName}</span>
                </p>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{bookingCount} bookings</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-muted/20 flex items-center justify-between">
                <div className="font-bold text-lg text-primary">{priceDisplay}</div>
                <Button size="sm" asChild>
                    <Link href={`/classes/${id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
