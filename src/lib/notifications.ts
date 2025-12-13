import prisma from "@/lib/prisma";

export async function createNotification({
    userId,
    type,
    title,
    body,
    link
}: {
    userId: string;
    type: string;
    title: string;
    body: string;
    link?: string;
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                body,
                link
            }
        });
        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null; // Don't crash flow if notification fails
    }
}
