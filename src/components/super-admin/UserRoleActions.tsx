"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { manageAdminRole } from "@/app/super-admin/users/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function UserRoleActions({ userId, currentRole, currentUserId }: { userId: string, currentRole: string, currentUserId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    if (userId === currentUserId) return <span className="text-muted-foreground text-sm">You</span>;
    if (currentRole === "OWNER") return <span className="text-muted-foreground text-sm">Owner</span>;
    if (currentRole === "SUPER_ADMIN") return <span className="text-muted-foreground text-sm">Super Admin</span>;

    const handlePromote = async () => {
        setIsLoading(true);
        const res = await manageAdminRole(userId, "PROMOTE");
        setIsLoading(false);
        if (res.success) toast.success("User promoted to Admin");
        else toast.error("Failed to promote user");
    };

    const handleDemote = async () => {
        setIsLoading(true);
        const res = await manageAdminRole(userId, "DEMOTE");
        setIsLoading(false);
        if (res.success) toast.success("User demoted to Student");
        else toast.error("Failed to demote user");
    };

    if (currentRole === "ADMIN") {
        return (
            <Button variant="destructive" size="sm" onClick={handleDemote} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Revoke Admin"}
            </Button>
        );
    }

    return (
        <Button variant="outline" size="sm" onClick={handlePromote} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Make Admin"}
        </Button>
    );
}
