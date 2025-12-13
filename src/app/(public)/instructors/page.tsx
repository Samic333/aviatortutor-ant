import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { InstructorCard } from "@/components/instructors/instructor-card";
import { InstructorFilters } from "@/components/instructors/instructor-filters";
import { InstructorSort } from "@/components/instructors/instructor-sort";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Prisma } from "@prisma/client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Force dynamic rendering since we depend on searchParams
export const dynamic = "force-dynamic";

export default async function FindInstructorPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Parse Search Params
    const query = typeof searchParams.q === 'string' ? searchParams.q : "";
    const minPrice = typeof searchParams.minPrice === 'string' ? parseFloat(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === 'string' ? parseFloat(searchParams.maxPrice) : undefined;
    const minRating = typeof searchParams.minRating === 'string' ? parseFloat(searchParams.minRating) : undefined;

    // Sort & Pagination
    const sort = typeof searchParams.sort === 'string' ? searchParams.sort : "rating";
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
    const pageSize = 12; // Adjusted for grid layout

    // Handle authority: can be string or array
    let authorities: string[] = [];
    if (typeof searchParams.authority === 'string') {
        authorities = [searchParams.authority];
    } else if (Array.isArray(searchParams.authority)) {
        authorities = searchParams.authority;
    }

    // Build Prisma Where Clause
    const whereClause: Prisma.InstructorProfileWhereInput = {
        AND: [
            { pendingApproval: false },
        ]
    };

    const andConditions = whereClause.AND as Prisma.InstructorProfileWhereInput[];

    // Text Search (Name or Bio)
    if (query) {
        andConditions.push({
            OR: [
                { bio: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
                // Allow searching by authority text too if user types it
                { authorities: { has: query } }
            ]
        });
    }

    // Price Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: Prisma.FloatNullableFilter = {};
        if (minPrice !== undefined) priceFilter.gte = minPrice;
        if (maxPrice !== undefined) priceFilter.lte = maxPrice;
        andConditions.push({ hourlyRateDefault: priceFilter });
    }

    // Rating Filter
    if (minRating !== undefined) {
        andConditions.push({
            rating: { gte: minRating }
        });
    }

    // Authority Filter (Overlap/HasSome logic)
    if (authorities.length > 0) {
        andConditions.push({
            authorities: { hasSome: authorities }
        });
    }

    // Determine Sort Order
    let orderBy: Prisma.InstructorProfileOrderByWithRelationInput = { rating: 'desc' };
    switch (sort) {
        case 'price_asc':
            orderBy = { hourlyRateDefault: 'asc' };
            break;
        case 'price_desc':
            orderBy = { hourlyRateDefault: 'desc' };
            break;
        case 'reviews':
            orderBy = { totalReviews: 'desc' };
            break;
        case 'rating':
        default:
            orderBy = { rating: 'desc' };
            break;
    }

    // Calculate Pagination
    const totalCount = await prisma.instructorProfile.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1) * pageSize;

    const instructors = await prisma.instructorProfile.findMany({
        where: whereClause,
        include: {
            user: true,
        },
        orderBy: orderBy,
        take: pageSize,
        skip: skip,
    });

    return (
        <div className="container py-8 min-h-screen">
            {/* Header */}
            <div className="mb-10 space-y-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">Find Your Instructor</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Connect with certified pilots and aviation experts customized to your learning needs.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <form className="w-full">
                            <Input
                                name="q"
                                placeholder="Search by name, aircraft, or bio..."
                                className="pl-11 h-12 w-full text-lg shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                                defaultValue={query}
                            />
                        </form>
                    </div>
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="h-12 w-full sm:w-auto gap-2 border-muted-foreground/20">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="mb-6 text-left">
                                    <SheetTitle>Filter Instructors</SheetTitle>
                                    <SheetDescription>
                                        Refine your search to find the perfect match.
                                    </SheetDescription>
                                </SheetHeader>
                                <InstructorFilters />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 shrink-0 space-y-8">
                    <div className="sticky top-24 rounded-lg border bg-card/50 p-6 backdrop-blur-sm">
                        <InstructorFilters />
                    </div>
                </aside>

                {/* Results Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h2 className="text-sm font-semibold text-muted-foreground">
                            Showing {instructors.length} of {totalCount} {totalCount === 1 ? 'instructor' : 'instructors'}
                        </h2>
                        <InstructorSort />
                    </div>

                    {instructors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/10">
                            <div className="rounded-full bg-muted/50 p-6 mb-4">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No instructors found</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                We couldn't find any instructors matching your current filters. Try adjusting your search criteria.
                            </p>
                            <Button asChild variant="link" className="mt-6 text-primary">
                                <Link href="/instructors">Clear all filters</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {instructors.map((instructor) => (
                                    <InstructorCard key={instructor.id} instructor={instructor} />
                                ))}
                            </div>

                            <div className="mt-12">
                                <PaginationControls
                                    totalPages={totalPages}
                                    currentPage={page}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
