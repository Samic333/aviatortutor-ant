"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Calendar, Users, Award, CreditCard, LifeBuoy, Settings, Plane, FileText } from "lucide-react";

interface SidebarProps {
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN" | "OWNER";
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const links = [
        // Student Links
        {
            role: "STUDENT",
            items: [
                { href: "/student", label: "Overview", icon: LayoutDashboard },
                { href: "/student/classes", label: "My Classes", icon: BookOpen },
                { href: "/student/bookings", label: "Bookings", icon: Calendar },
                { href: "/student/browse-instructors", label: "Browse Instructors", icon: Users },
                { href: "/student/certificates", label: "Certificates", icon: Award },
                { href: "/student/billing", label: "Billing", icon: CreditCard },
                { href: "/student/support", label: "Support", icon: LifeBuoy },
            ]
        },
        // Instructor Links
        {
            role: "INSTRUCTOR",
            items: [
                { href: "/instructor", label: "Overview", icon: LayoutDashboard },
                { href: "/instructor/classes", label: "My Classes", icon: BookOpen },
                { href: "/instructor/bookings", label: "Schedule", icon: Calendar },
                { href: "/instructor/earnings", label: "Earnings", icon: CreditCard },
                // { href: "/instructor/messages", label: "Messages", icon: FileText }, // Using FileText for now as MessageSquare clashes? Or just standard icon
                { href: "/instructor/profile", label: "Profile", icon: Settings },
                { href: "/instructor/support", label: "Support", icon: LifeBuoy },
            ]
        },
        // Admin Links
        {
            role: "ADMIN",
            items: [
                { href: "/admin", label: "Overview", icon: LayoutDashboard },
                { href: "/admin/instructors", label: "Instructors", icon: Users },
                { href: "/admin/classes", label: "Classes", icon: BookOpen },
                { href: "/admin/disputes", label: "Disputes", icon: LifeBuoy },
                { href: "/admin/users", label: "Users", icon: Users },
            ]
        },
        // Super Admin Links
        {
            role: "SUPER_ADMIN",
            items: [
                { href: "/super-admin", label: "Overview", icon: LayoutDashboard },
                { href: "/super-admin/users", label: "User Management", icon: Users },
                { href: "/super-admin/financials", label: "Financials", icon: CreditCard },
                { href: "/super-admin/settings", label: "Platform Settings", icon: Settings },
            ]
        },
        // Owner Links
        {
            role: "OWNER",
            items: [
                { href: "/owner", label: "Command Deck", icon: LayoutDashboard },
                { href: "/owner/stats", label: "Live Stats", icon: Award },
                { href: "/owner/logs", label: "System Logs", icon: FileText },
            ]
        }
    ];

    const roleLinks = links.find(l => l.role === role)?.items || [];

    return (
        <div className="hidden border-r bg-background md:block w-64 flex-col fixed inset-y-0 z-30">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <Plane className="h-5 w-5 rotate-[-45deg] text-primary" />
                    <span>AviatorTutor</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-4 text-sm font-medium">
                    {roleLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <div className="text-xs text-muted-foreground px-4">
                    Logged in as <span className="font-semibold">{role}</span>
                </div>
            </div>
        </div>
    );
}
