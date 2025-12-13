import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import React from "react";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/");
    }

    if (user.role !== "SUPER_ADMIN") {
        redirect("/");
    }

    return (
        <DashboardShell role="SUPER_ADMIN" user={user}>
            {children}
        </DashboardShell>
    );
}
