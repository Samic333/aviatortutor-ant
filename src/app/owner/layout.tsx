import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import React from "react";

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/");
    }

    if (user.role !== "OWNER") {
        redirect("/");
    }

    return (
        <DashboardShell role="OWNER" user={user}>
            {children}
        </DashboardShell>
    );
}
