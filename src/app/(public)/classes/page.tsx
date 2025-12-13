
import prisma from "@/lib/prisma";
import { ClassCard } from "@/components/class/ClassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { redirect } from "next/navigation";

// Since this is a server component, we receive searchParams
export const dynamic = 'force-dynamic';

interface ClassesPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ClassesPage({ searchParams }: ClassesPageProps) {
    // Parse search params
    const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
    const authority = typeof searchParams.authority === 'string' ? searchParams.authority : "ALL";
    const standard = typeof searchParams.standard === 'string' ? searchParams.standard : "ALL";
    const airline = typeof searchParams.airline === 'string' ? searchParams.airline : "ALL";
    const category = typeof searchParams.category === 'string' ? searchParams.category : "ALL";
    const type = typeof searchParams.type === 'string' ? searchParams.type : "ALL";

    // Construct Prisma where clause
    const where: any = {
        status: "PUBLISHED",
    };

    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { instructor: { user: { name: { contains: query, mode: 'insensitive' } } } },
        ];
    }

    if (authority !== "ALL") {
        where.authority = authority;
    }

    if (standard !== "ALL") {
        where.authorityStandard = standard;
    }

    if (airline !== "ALL") {
        where.instructor = {
            airlineId: airline
        };
    }

    // Since 'category' isn't a direct field in schema provided but requested in plan, 
    // we'll assume it maps to tags for now or check if strict category field exists.
    // Looking at schema, Class has no distinct 'category' field, but has 'tags'.
    // However, the home page links to ?category=... so we should probably filter detailedDescription or title if tags not reliable.
    // Or strictly use tags. Let's try matching tags since that's likely intended usage.
    if (category !== "ALL") {
        where.OR = [
            ...(where.OR || []), // Keep existing OR if any
            { tags: { has: category } },
            { title: { contains: category, mode: 'insensitive' } } // Fallback to title search for category
        ];
    }

    if (type !== "ALL") {
        where.type = type;
    }

    // Fetch classes
    const [classes, airlines] = await Promise.all([
        prisma.class.findMany({
            where,
            include: {
                instructor: {
                    include: {
                        user: true,
                        airline: true
                    }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.airline.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, country: true }
        })
    ]);

    // Server Action or just standard form submission via GET?
    // Using standard form submission is easiest for search/filter without complex client state.
    async function searchAction(formData: FormData) {
        "use server";
        const q = formData.get("q")?.toString();
        const authority = formData.get("authority")?.toString();
        const standard = formData.get("standard")?.toString();
        const airline = formData.get("airline")?.toString();
        const type = formData.get("type")?.toString();

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (authority && authority !== "ALL") params.set("authority", authority);
        if (standard && standard !== "ALL") params.set("standard", standard);
        if (airline && airline !== "ALL") params.set("airline", airline);
        if (type && type !== "ALL") params.set("type", type);

        redirect(`/classes?${params.toString()}`);
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Classes</h1>
                    <p className="text-muted-foreground mt-1">Find the perfect training for your aviation career</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <form action={searchAction} className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <Search className="h-4 w-4" /> Search
                                    </h3>
                                    <Input
                                        name="q"
                                        placeholder="Search by keyword..."
                                        defaultValue={query}
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4" /> Filters
                                    </h3>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Authority</label>
                                        <Select name="authority" defaultValue={authority}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Authorities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Authorities</SelectItem>
                                                <SelectItem value="FAA">FAA (USA)</SelectItem>
                                                <SelectItem value="EASA">EASA (Europe)</SelectItem>
                                                <SelectItem value="CAA">CAA (UK)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Standard</label>
                                        <Select name="standard" defaultValue={standard}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Standards" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Standards</SelectItem>
                                                <SelectItem value="ICAO">ICAO</SelectItem>
                                                <SelectItem value="FAA">FAA</SelectItem>
                                                <SelectItem value="EASA">EASA</SelectItem>
                                                <SelectItem value="IATA">IATA</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Airline</label>
                                        <Select name="airline" defaultValue={airline}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Airlines" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Airlines</SelectItem>
                                                {airlines.map((a) => (
                                                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.country})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Class Type</label>
                                        <Select name="type" defaultValue={type}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All Types</SelectItem>
                                                <SelectItem value="ONE_ON_ONE">1-on-1 Session</SelectItem>
                                                <SelectItem value="GROUP">Group Class</SelectItem>
                                                <SelectItem value="CHAT">Chat Consultation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">Apply Filters</Button>

                                {(query || authority !== "ALL" || type !== "ALL") && (
                                    <Button variant="ghost" className="w-full" asChild>
                                        <Link href="/classes">Clear Filters</Link>
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Grid */}
                <div className="lg:col-span-3">
                    {classes.length === 0 ? (
                        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                            <h3 className="text-lg font-semibold">No classes found</h3>
                            <p className="text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
                            <Button variant="link" asChild className="mt-4">
                                <Link href="/classes">Clear all filters</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classes.map((cls) => (
                                <ClassCard
                                    key={cls.id}
                                    id={cls.id}
                                    title={cls.title}
                                    instructorName={cls.instructor.user.name || "Unknown Instructor"}
                                    authority={cls.authority}
                                    pricePerHour={cls.pricePerHour}
                                    fixedPrice={cls.fixedPrice}
                                    type={cls.type}
                                    bookingCount={cls._count.bookings}
                                    description={cls.shortDescription}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
