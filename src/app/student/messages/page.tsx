import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function StudentMessagesPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") redirect("/");

    const conversations = await prisma.conversation.findMany({
        where: {
            participants: { some: { id: user.id } }
        },
        include: {
            participants: {
                where: { id: { not: user.id } },
                select: { name: true, email: true, image: true, role: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">Chat with your instructors.</p>
            </div>

            {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No conversations yet.</p>
                    <Button variant="outline" asChild>
                        <Link href="/student/browse-instructors">Find an Instructor</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {conversations.map((conv) => {
                        const otherParticipant = conv.participants[0] || { name: "Unknown", email: "Unknown" };
                        const lastMessage = conv.messages[0];
                        return (
                            <Link key={conv.id} href={`/student/messages/${conv.id}`}>
                                <Card className="hover:bg-muted/50 transition-colors">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {otherParticipant.name?.[0] || "?"}
                                            </div>
                                            <div>
                                                <div className="font-medium">{otherParticipant.name}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {lastMessage ? lastMessage.content : "No messages yet"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ""}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
