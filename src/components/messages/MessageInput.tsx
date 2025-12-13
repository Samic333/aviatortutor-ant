"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/messages";
import { toast } from "sonner";

export function MessageInput({ conversationId }: { conversationId: string }) {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const result = await sendMessage(conversationId, content);
            if (result.success) {
                setContent("");
                // Refresh? Or optimistic update? For now rely on revalidatePath in action
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            toast.error("Error sending message");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                className="flex-1 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}
