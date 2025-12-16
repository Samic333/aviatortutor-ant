"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAuditAction } from "@/lib/audit";

export async function processMockPayment(bookingId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { class: true }
        });

        if (!booking) return { error: "Booking not found" };
        if (booking.studentId !== user.id) return { error: "Not authorized to pay for this booking" };
        if (booking.paymentStatus === "PAID") return { error: "Booking is already paid" };

        // Process "Payment"
        // In a real app, verify Stripe session here.

        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: "CONFIRMED",
                paymentStatus: "PAID"
            }
        });

        await logAuditAction({
            action: "BOOKING_PAID_MOCK",
            entityType: "Booking",
            entityId: booking.id,
            actor: { id: user.id, role: user.role, email: user.email ?? undefined },
            status: "SUCCESS",
            metadata: { amount: booking.price, currency: booking.currency }
        });

        revalidatePath("/student/bookings");
        revalidatePath(`/student/bookings/${bookingId}`);

        return { success: true };
    } catch (error) {
        console.error("Payment processing error:", error);
        return { error: "Payment failed to process" };
    }
}
