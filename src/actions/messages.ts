"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getRecentConversations(limit = 10) {
    const user = await getCurrentUser();
    if (!user) return [];

    // Fetch conversations with participants and recent messages
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: {
                some: { id: user.id }
            }
        },
        include: {
            participants: {
                select: { id: true, name: true, image: true, role: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            readAt: null,
                            senderId: { not: user.id }
                        }
                    }
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        },
        take: limit
    });

    // Format for UI
    return conversations.map(c => {
        const otherParticipant = c.participants.find(p => p.id !== user.id) || c.participants[0];
        const lastMsg = c.messages[0];
        return {
            id: c.id,
            otherParticipant,
            lastMessage: lastMsg?.content || "No messages yet",
            lastMessageAt: lastMsg?.createdAt || c.updatedAt,
            unreadCount: c._count.messages
        };
    });
}

export async function getUnreadMessageCount() {
    const user = await getCurrentUser();
    if (!user) return 0;

    return await prisma.message.count({
        where: {
            conversation: {
                participants: {
                    some: { id: user.id }
                }
            },
            senderId: { not: user.id },
            readAt: null
        }
    });
}
