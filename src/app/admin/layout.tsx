import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/");
    }

    if (user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <DashboardShell role="ADMIN" user={user}>
            {children}
        </DashboardShell>
    );
}
