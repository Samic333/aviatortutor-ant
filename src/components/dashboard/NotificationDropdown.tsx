"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRecentNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function NotificationDropdown() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const count = await getUnreadNotificationCount();
        const recents = await getRecentNotifications(5);

        setUnreadCount(count);
        setNotifications(recents);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchData();
        }
    };

    const handleRead = async (id: string, link: string | null) => {
        await markNotificationAsRead(id);
        fetchData(); // Update local state
        setIsOpen(false);
        if (link) {
            router.push(link);
        }
    };

    const handleMarkAllRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await markAllNotificationsAsRead();
        fetchData();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-500">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No notifications yet
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 py-1 max-h-[300px] overflow-y-auto">
                        {notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={`cursor-pointer flex flex-col items-start gap-1 p-3 ${!n.isRead ? "bg-blue-50/50" : ""}`}
                                onClick={() => handleRead(n.id, n.link)}
                            >
                                <div className="flex w-full justify-between items-start gap-2">
                                    <span className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                                        {n.type === "BOOKING_CONFIRMED" ? "Booking Confirmed" : n.title}
                                    </span>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {n.body}
                                </p>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 justify-center text-blue-600 font-medium cursor-pointer" asChild>
                    <Link href="/dashboard/notifications">View All Notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
