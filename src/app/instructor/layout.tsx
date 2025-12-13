import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import React from "react";

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/");
    }

    if (user.role !== "INSTRUCTOR") {
        redirect("/");
    }

    return (
        <DashboardShell role="INSTRUCTOR" user={user}>
            {children}
        </DashboardShell>
    );
}
