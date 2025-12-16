"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

export async function manageAdminRole(targetUserId: string, action: "PROMOTE" | "DEMOTE") {
    const user = await getCurrentUser();

    // Only Super Admin or Owner
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (!targetUser) return { success: false, error: "User not found" };

        if (action === "PROMOTE") {
            await prisma.user.update({
                where: { id: targetUserId },
                data: { role: "ADMIN" }
            });
        } else {
            await prisma.user.update({
                where: { id: targetUserId },
                data: { role: "STUDENT" } // Demote to student? Or previous? Defaulting to Student.
            });
        }

        await logAuditAction({
            action: action === "PROMOTE" ? "USER_PROMOTED_ADMIN" : "USER_DEMOTED_ADMIN",
            entityType: "User",
            entityId: targetUserId,
            actor: { id: user.id, role: user.role, email: user.email ?? undefined },
            status: "SUCCESS"
        });

        revalidatePath("/super-admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to manage admin role:", error);
        return { success: false, error: "Failed to update role" };
    }
}
