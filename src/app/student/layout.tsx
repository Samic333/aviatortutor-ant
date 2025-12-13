import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import React from "react";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/");
    }

    if (user.role !== "STUDENT") {
        redirect("/");
    }

    return (
        <DashboardShell role="STUDENT" user={user}>
            {children}
        </DashboardShell>
    );
}
