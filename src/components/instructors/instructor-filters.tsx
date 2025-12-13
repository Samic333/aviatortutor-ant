"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

const AUTHORITIES = [
    "FAA",
    "EASA",
    "TC (Canada)",
    "CASA (Australia)",
    "UK CAA",
    "DGCA (India)",
];

export function InstructorFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for filters to avoid excessive URL updates on every keystroke
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [rating, setRating] = useState(searchParams.get("minRating") || "0");
    const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>(
        searchParams.getAll("authority")
    );

    // Sync state with URL params on mount/update
    useEffect(() => {
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setRating(searchParams.get("minRating") || "0");
        // Handle 'authority' which can be multiple
        const authParams = searchParams.getAll("authority");
        // If getAll returns empty array but it might be a single string in some generic searchParams implementations, 
        // but in Next.js getAll should be correct.
        setSelectedAuthorities(authParams);
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        if (rating && rating !== "0") params.set("minRating", rating);
        else params.delete("minRating");

        params.delete("authority");
        selectedAuthorities.forEach((auth) => params.append("authority", auth));

        // Reset page to 1 if pagination exists (not yet implemented but good practice)
        // params.set("page", "1"); 

        router.push(`/instructors?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minPrice");
        params.delete("maxPrice");
        params.delete("minRating");
        params.delete("authority");
        // Keep the search query 'q' if user wants to keep the text search
        router.push(`/instructors?${params.toString()}`);
    };

    const toggleAuthority = (auth: string) => {
        setSelectedAuthorities((prev) =>
            prev.includes(auth)
                ? prev.filter((a) => a !== auth)
                : [...prev, auth]
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" /> Filters
                </h3>
                {(minPrice || maxPrice || rating !== "0" || selectedAuthorities.length > 0) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <X className="mr-1 h-3 w-3" /> Clear
                    </Button>
                )}
            </div>

            <Separator />

            {/* Price Filter */}
            <div className="space-y-4">
                <Label className="text-sm font-medium">Hourly Rate (USD)</Label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="h-9 pl-6"
                        />
                    </div>
                    <span className="text-muted-foreground text-sm">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="h-9 pl-6"
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Rating Filter */}
            <div className="space-y-4">
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5 & up (Excellent)</SelectItem>
                        <SelectItem value="4.0">4.0 & up (Very Good)</SelectItem>
                        <SelectItem value="3.0">3.0 & up (Good)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {/* Authority Filter */}
            <div className="space-y-4">
                <Label className="text-sm font-medium">Certifying Authority</Label>
                <div className="space-y-2.5">
                    {AUTHORITIES.map((auth) => (
                        <div key={auth} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`auth-${auth}`}
                                checked={selectedAuthorities.includes(auth)}
                                onChange={() => toggleAuthority(auth)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                            />
                            <label
                                htmlFor={`auth-${auth}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {auth}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={applyFilters} className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Apply Filters
            </Button>
        </div>
    );
}
