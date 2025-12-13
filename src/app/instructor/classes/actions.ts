"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function togglePublishStatus(classId: string, currentStatus: string) {
    const user = await getCurrentUser();

    if (!user || user.role !== "INSTRUCTOR") {
        return { error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const cls = await prisma.class.findUnique({
            where: { id: classId },
            include: { instructor: true }
        });

        if (!cls || cls.instructor.userId !== user.id) {
            return { error: "Class not found or unauthorized" };
        }

        const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

        await prisma.class.update({
            where: { id: classId },
            data: { status: newStatus }
        });

        revalidatePath("/instructor/classes");
        return { success: true, status: newStatus };
    } catch (error) {
        console.error("Error toggling status:", error);
        return { error: "Failed to update status" };
    }
}
