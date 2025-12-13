"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRecentConversations, getUnreadMessageCount } from "@/actions/messages";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface MessageDropdownProps {
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN" | "OWNER";
}

export function MessageDropdown({ role }: MessageDropdownProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [conversations, setConversations] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Polling interaction could go here, but simple fetch on mount/open is safer MVP
    }, []);

    const fetchData = async () => {
        const count = await getUnreadMessageCount();
        const recents = await getRecentConversations(5);

        setUnreadCount(count);
        setConversations(recents);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchData(); // Refresh on open
        }
    };

    const inboxLink = role === "INSTRUCTOR" ? "/instructor/messages" : "/student/messages";

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Messages</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No messages yet
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 py-1">
                        {conversations.map((c) => (
                            <DropdownMenuItem key={c.id} className="cursor-pointer" asChild>
                                <Link href={`${inboxLink}/${c.id}`} className="flex flex-col items-start gap-1 p-3">
                                    <div className="flex w-full justify-between items-center">
                                        <span className={`font-semibold ${c.unreadCount > 0 ? "text-blue-600" : ""}`}>
                                            {c.otherParticipant?.name || "User"}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {c.lastMessageAt ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true }) : ''}
                                        </span>
                                    </div>
                                    <p className={`text-xs w-full truncate ${c.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                                        {c.lastMessage}
                                    </p>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 justify-center text-blue-600 font-medium cursor-pointer" asChild>
                    <Link href={inboxLink}>Open Inbox</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
