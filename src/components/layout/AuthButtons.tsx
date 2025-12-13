"use client";

import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function AuthButtons() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSignInClick = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("auth", "signin");
        router.push(`${pathname}?${params.toString()}`);
    };

    // Removed blocking loader to prevent infinite spinner issue
    // if (status === "loading") { ... }

    if (session?.user) {
        // Determine dashboard link based on role
        let dashboardLink = "/student";
        const role = (session.user as any).role;

        if (role === "INSTRUCTOR") dashboardLink = "/instructor";
        else if (role === "ADMIN") dashboardLink = "/admin";
        else if (role === "SUPER_ADMIN") dashboardLink = "/super-admin";
        else if (role === "OWNER") dashboardLink = "/owner";

        return (
            <Button variant="ghost" size="sm" asChild>
                <Link href={dashboardLink}>Dashboard</Link>
            </Button>
        );
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleSignInClick}>
            Sign In
        </Button>
    );
}
