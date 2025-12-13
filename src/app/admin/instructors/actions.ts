"use server";

import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

import { getCurrentUser } from "@/lib/session";

export async function approveInstructor(instructorId: string) {
    const user = await getCurrentUser();
    // Validate Admin Access (Hierarchy aware)
    if (!user || !["ADMIN", "SUPER_ADMIN", "OWNER"].includes(user.role)) {
        await logAuditAction({
            action: "INSTRUCTOR_APPROVAL_ATTEMPT_UNAUTHORIZED",
            entityType: "InstructorProfile",
            entityId: instructorId,
            actor: user ? { id: user.id, role: user.role, email: user.email ?? undefined } : null,
            status: "FAIL",
            metadata: { reason: "Unauthorized Role" }
        });
        return { success: false, error: "Unauthorized" };
    }

    try {
        const instructor = await prisma.instructorProfile.update({
            where: { id: instructorId },
            data: { pendingApproval: false },
            include: { user: true }
        });

        // Audit Log
        await logAuditAction({
            action: "INSTRUCTOR_APPROVED",
            entityType: "InstructorProfile",
            entityId: instructorId,
            targetUserId: instructor.userId,
            actor: { id: user.id, role: user.role, email: user.email ?? undefined },
            status: "SUCCESS"
        });

        await createNotification({
            userId: instructor.userId,
            type: "INSTRUCTOR_APPROVED",
            title: "Application Approved",
            body: "Your instructor application has been approved! You can now create classes.",
            link: "/instructor"
        });

        revalidatePath("/admin/instructors");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve instructor:", error);
        return { success: false, error: "Failed to approve instructor" };
    }
}

export async function rejectInstructor(instructorId: string) {
    // For now, rejection just leaves them pending or could delete. 
    // Implementing a soft reject that notifications them?
    // Let's just return not implemented or do nothing for now to be safe.
    return { success: false, error: "Rejection not implemented yet" };
}
