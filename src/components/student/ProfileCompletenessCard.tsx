"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";

interface ProfileCompletenessCardProps {
    completeness: number; // 0-100
    missingFields: string[];
}

export function ProfileCompletenessCard({ completeness, missingFields }: ProfileCompletenessCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold">{completeness}%</span>
                </div>

                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${completeness}%` }}
                    />
                </div>

                <div className="mt-4 space-y-2">
                    {missingFields.length > 0 ? (
                        <p className="text-xs text-muted-foreground">
                            Add {missingFields.slice(0, 2).join(", ")} {missingFields.length > 2 && `and ${missingFields.length - 2} more`} to reach 100%
                        </p>
                    ) : (
                        <p className="text-xs text-green-600 font-medium">
                            Your profile is complete!
                        </p>
                    )}

                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/student/profile">Edit Profile</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
