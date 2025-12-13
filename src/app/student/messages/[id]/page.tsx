import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";

export default async function ConversationPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") redirect("/");

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
        include: {
            participants: { select: { id: true, name: true, image: true, role: true } },
            messages: { orderBy: { createdAt: 'asc' } }
        }
    });

    if (!conversation) redirect("/student/messages");

    // Authorization: User must be participant
    const isParticipant = conversation.participants.some(p => p.id === user.id);
    if (!isParticipant) redirect("/student/messages");

    const otherParticipant = conversation.participants.find(p => p.id !== user.id);

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">{otherParticipant?.name || "Chat"}</h1>
                <p className="text-muted-foreground text-sm">Conversation started {new Date(conversation.createdAt).toLocaleDateString()}</p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    <MessageList
                        messages={conversation.messages}
                        currentUserId={user.id}
                    />
                </CardContent>
                <div className="p-4 border-t bg-background">
                    <MessageInput conversationId={conversation.id} />
                </div>
            </Card>
        </div>
    );
}
