"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/lib/audit";

export async function sendMessage(conversationId: string, content: string) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // Validate Authorization: User must be in conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: { select: { id: true } } }
        });

        if (!conversation) return { success: false, error: "Conversation not found" };

        const isParticipant = conversation.participants.some(p => p.id === user.id);
        if (!isParticipant) return { success: false, error: "Forbidden" };

        // Create Message
        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: user.id,
                content
            }
        });

        // Audit Log
        await logAuditAction({
            action: "MESSAGE_SENT",
            entityType: "Message",
            entityId: message.id,
            actor: { id: user.id, role: user.role, email: user.email },
            status: "SUCCESS",
            metadata: { conversationId }
        });

        revalidatePath(`/student/messages/${conversationId}`);
        revalidatePath(`/instructor/messages/${conversationId}`);
        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to send message" };
    }
}
