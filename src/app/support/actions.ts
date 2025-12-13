"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ticketSchema = z.object({
    type: z.enum(["TECHNICAL", "PAYMENT", "DISPUTE", "OTHER"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    subject: z.string().min(5, "Subject too short"),
    message: z.string().min(20, "Please provide more detail"),
    bookingId: z.string().optional()
});

export async function createSupportTicket(data: z.infer<typeof ticketSchema>) {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const result = ticketSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await prisma.supportTicket.create({
            data: {
                createdById: user.id,
                type: data.type,
                priority: data.priority,
                subject: data.subject,
                description: data.message,
                bookingId: data.bookingId || undefined
            } as any
        });

        revalidatePath("/student/support");
        revalidatePath("/instructor/support");
        revalidatePath("/admin/support");
        return { success: true };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return { error: "Failed to submit ticket" };
    }
}

export async function updateTicketStatus(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status }
        });

        revalidatePath("/admin/support");
        revalidatePath(`/admin/support/${ticketId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating ticket status:", error);
        return { error: "Failed to update status" };
    }
}
