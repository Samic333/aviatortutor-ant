"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date | string;
}

export function MessageList({ messages, currentUserId }: { messages: Message[], currentUserId: string }) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col gap-4">
            {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                    <div key={msg.id} className={cn("flex flex-col max-w-[75%]", isMe ? "self-end items-end" : "self-start items-start")}>
                        <div className={cn("px-4 py-2 rounded-lg text-sm", isMe ? "bg-primary text-primary-foreground" : "bg-muted")}>
                            {msg.content}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                )
            })}
            <div ref={bottomRef} />
        </div>
    );
}
