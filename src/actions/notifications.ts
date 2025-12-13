"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getRecentNotifications(limit = 10) {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function getUnreadNotificationCount() {
    const user = await getCurrentUser();
    if (!user) return 0;

    return await prisma.notification.count({
        where: {
            userId: user.id,
            isRead: false,
        },
    });
}

export async function markNotificationAsRead(id: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    try {
        await prisma.notification.update({
            where: { id, userId: user.id },
            data: { isRead: true },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update notification" };
    }
}

export async function markAllNotificationsAsRead() {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    try {
        await prisma.notification.updateMany({
            where: { userId: user.id, isRead: false },
            data: { isRead: true },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update notifications" };
    }
}
