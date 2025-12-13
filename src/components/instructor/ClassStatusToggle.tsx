"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { togglePublishStatus } from "@/app/instructor/classes/actions";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClassStatusToggleProps {
    classId: string;
    initialStatus: string;
}

export function ClassStatusToggle({ classId, initialStatus }: ClassStatusToggleProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        const result = await togglePublishStatus(classId, status);
        setIsLoading(false);

        if (result.success && result.status) {
            setStatus(result.status);
        } else {
            // Ideally show toast error here
            console.error(result.error);
        }
    };

    const isPublished = status === "PUBLISHED";

    return (
        <div className="flex items-center gap-2">
            <Badge variant={isPublished ? "default" : "secondary"}>
                {status}
            </Badge>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                disabled={isLoading}
                className="h-6 text-xs px-2"
            >
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : (isPublished ? "Unpublish" : "Publish")}
            </Button>
        </div>
    );
}
