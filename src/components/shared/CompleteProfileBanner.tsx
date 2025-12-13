"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CompleteProfileBannerProps {
    role: "INSTRUCTOR" | "STUDENT";
}

export function CompleteProfileBanner({ role }: CompleteProfileBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(`dismiss-profile-banner-${role}`);
        if (!dismissed) {
            setIsVisible(true);
        }
    }, [role]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`dismiss-profile-banner-${role}`, "true");
    };

    if (!isVisible) return null;

    const editLink = role === "INSTRUCTOR" ? "/instructor/profile/edit" : "/student/profile/edit";

    return (
        <Alert className="mb-6 relative bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800 font-semibold mb-1">Complete your profile</AlertTitle>
            <AlertDescription className="text-blue-600">
                It looks like your profile is incomplete. <Link href={editLink} className="underline hover:text-blue-800">Update it now</Link> to improve your visibility.
            </AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-blue-400 hover:text-blue-600"
                onClick={handleDismiss}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
            </Button>
        </Alert>
    );
}
