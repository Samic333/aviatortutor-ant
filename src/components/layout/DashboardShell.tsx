"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
    Bell,
    Menu,
    X,
    User as UserIcon,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    BookOpen,
    Calendar,
    Search,
    Award,
    CreditCard,
    LifeBuoy,
    MessageSquare,
    DollarSign,
    Users,
    FileText,
    AlertTriangle,
    Activity,
    Settings,
    Shield,
    Briefcase
} from "lucide-react";
import { MessageDropdown } from "@/components/dashboard/MessageDropdown";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";

interface DashboardShellProps {
    children: React.ReactNode;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN" | "OWNER";
    user?: {
        name?: string | null;
        image?: string | null;
        email?: string | null;
    };
}

const getNavItems = (role: string) => {
    switch (role) {
        case "STUDENT":
            return [
                { label: "Overview", href: "/student", icon: LayoutDashboard },
                { label: "Classes", href: "/student/classes", icon: BookOpen },
                { label: "Bookings", href: "/student/bookings", icon: Calendar },
                { label: "Browse Instructors", href: "/student/browse-instructors", icon: Search },
                { label: "Certificates", href: "/student/certificates", icon: Award },
                { label: "Billing", href: "/student/billing", icon: CreditCard },
                { label: "Support", href: "/student/support", icon: LifeBuoy },
            ];
        case "INSTRUCTOR":
            return [
                { label: "Overview", href: "/instructor", icon: LayoutDashboard },
                { label: "My Classes", href: "/instructor/classes", icon: BookOpen },
                { label: "Create Class", href: "/instructor/classes/new", icon: FileText },
                { label: "Bookings", href: "/instructor/bookings", icon: Calendar },
                { label: "Earnings", href: "/instructor/earnings", icon: DollarSign },
                { label: "Messages", href: "/instructor/messages", icon: MessageSquare },
                { label: "Profile", href: "/instructor/profile", icon: UserIcon },
                { label: "Support", href: "/instructor/support", icon: LifeBuoy },
            ];
        case "ADMIN":
            return [
                { label: "Overview", href: "/admin", icon: LayoutDashboard },
                { label: "Instructors", href: "/admin/instructors", icon: Users },
                { label: "Classes", href: "/admin/classes", icon: BookOpen },
                { label: "Users", href: "/admin/users", icon: Users },
                { label: "Disputes & Support", href: "/admin/disputes", icon: AlertTriangle },
                { label: "Logs", href: "/admin/logs", icon: FileText },
            ];
        case "SUPER_ADMIN":
            return [
                { label: "Overview", href: "/super-admin", icon: LayoutDashboard },
                { label: "Admins", href: "/super-admin/admins", icon: Shield },
                { label: "Settings", href: "/super-admin/settings", icon: Settings },
                { label: "Finance", href: "/super-admin/finance", icon: DollarSign },
            ];
        case "OWNER":
            return [
                { label: "Command Deck", href: "/owner", icon: Activity },
                { label: "Finance", href: "/owner/finance", icon: DollarSign },
                { label: "Operations", href: "/owner/operations", icon: Briefcase },
            ];
        default:
            return [];
    }
};

const getRoleLabel = (role: string) => {
    switch (role) {
        case "SUPER_ADMIN": return "Super Admin";
        default: return role.charAt(0) + role.slice(1).toLowerCase();
    }
};

export function DashboardShell({
    children,
    role,
    user,
}: DashboardShellProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const navItems = getNavItems(role);
    const roleLabel = getRoleLabel(role);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 w-full border-b bg-white">
                <div className="flex h-16 items-center px-4 md:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden mr-2"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>

                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-900 mr-4">
                        <span>AviatorTutor</span>
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 hidden sm:inline-block">
                            {roleLabel} Dashboard
                        </span>
                    </Link>

                    <div className="ml-auto flex items-center gap-4">
                        <MessageDropdown role={role} />
                        <NotificationDropdown />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg z-40 py-1 text-sm font-medium">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-gray-900 truncate">{user?.name || "User"}</p>
                                            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                                        </div>
                                        {role === "INSTRUCTOR" && (
                                            <Link
                                                href="/instructor/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <UserIcon className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        )}
                                        {role === "STUDENT" && (
                                            <Link
                                                href="/student/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <UserIcon className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-200 ease-in-out md:static md:translate-x-0 pt-16 md:pt-0",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="h-full flex flex-col py-4">
                        <div className="md:hidden absolute top-4 right-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="space-y-1 px-2 flex-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="px-4 py-4 border-t">
                            <div className="flex flex-col gap-1">
                                <Link href={`/${role.toLowerCase()}/support`} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-2">
                                    <LifeBuoy className="h-3 w-3" /> Support
                                </Link>
                                <div className="text-xs text-gray-400 mt-2">© 2024 AviatorTutor</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
