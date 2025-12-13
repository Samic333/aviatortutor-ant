"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function addAdmin(email: string) {
    const user = await getCurrentUser();

    if (!user || user.role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!targetUser) {
            return { error: "User not found with this email." };
        }

        if (targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") {
            return { error: "User is already an admin." };
        }

        await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" }
        });

        revalidatePath("/super-admin/admins");
        return { success: true };
    } catch (error) {
        console.error("Error adding admin:", error);
        return { error: "Failed to add admin" };
    }
}
