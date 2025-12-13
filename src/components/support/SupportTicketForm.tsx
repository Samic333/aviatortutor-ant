"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupportTicket } from "@/app/support/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SupportTicketForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        type: "TECHNICAL",
        priority: "MEDIUM",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await createSupportTicket(formData as any);
        setIsLoading(false);

        if (result.success) {
            toast.success("Ticket submitted successfully. We'll be in touch soon.");
            setFormData({ subject: "", type: "TECHNICAL", priority: "MEDIUM", message: "" });
        } else {
            toast.error(result.error || "Failed to submit ticket");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of issue"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TECHNICAL">Technical Issue</SelectItem>
                            <SelectItem value="PAYMENT">Billing & Payment</SelectItem>
                            <SelectItem value="DISPUTE">Dispute</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(val) => setFormData({ ...formData, priority: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Description</Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Detailed explanation of the problem..."
                    className="min-h-[150px]"
                    required
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Ticket
            </Button>
        </form>
    );
}
