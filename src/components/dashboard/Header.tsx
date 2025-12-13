"use client"

import { Button } from "@/components/ui/button";
import { Bell, MessageSquare } from "lucide-react";
import { signOut } from "next-auth/react";

export function DashboardHeader({ user }: { user: any }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center gap-4 border-b bg-background px-6">
            <div className="flex-1">
                {/* Breadcrumb or Title placeholder */}
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative" asChild>
                    <a href={user.role === "INSTRUCTOR" ? "/instructor/messages" : "/student/messages"}>
                        <MessageSquare className="h-5 w-5" />
                        {/* Unread badge logic here */}
                    </a>
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {/* Unread badge logic here */}
                </Button>

                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name?.[0]}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign Out</Button>
                </div>
            </div>
        </header>
    );
}
