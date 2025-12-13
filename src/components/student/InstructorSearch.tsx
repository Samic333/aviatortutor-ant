"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export function InstructorSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [authority, setAuthority] = useState(searchParams.get("authority") || "");

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (authority) params.set("authority", authority);
        router.push(`/student/browse-instructors?${params.toString()}`);
    };

    return (
        <form onSubmit={onSearch} className="flex gap-4 p-4 border rounded-lg bg-card mb-6 flex-wrap md:flex-nowrap">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by name, aircraft, or language..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="min-w-[150px]">
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                >
                    <option value="">All Authorities</option>
                    <option value="FAA">FAA</option>
                    <option value="EASA">EASA</option>
                    <option value="UK CAA">UK CAA</option>
                    <option value="CASA">CASA</option>
                    <option value="TCCA">TCCA</option>
                </select>
            </div>
            <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    );
}
