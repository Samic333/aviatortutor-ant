"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { PaymentService } from "@/lib/payments";
import { redirect } from "next/navigation";
import { logAuditAction } from "@/lib/audit";

export async function createBookingAndCheckout(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "You must be signed in to book a class" };
    }

    const classId = formData.get("classId") as string;
    const scheduledTimeStr = formData.get("scheduledTime") as string;

    if (!classId) return { error: "Class ID is required" };

    const cls = await prisma.class.findUnique({
        where: { id: classId },
        include: { instructor: true }
    });

    if (!cls) return { error: "Class not found" };

    // Create pending booking
    const booking = await prisma.booking.create({
        data: {
            classId: cls.id,
            studentId: user.id, // This assumes User ID maps to Student? 
            // Wait, schema says Booking relates to 'Student' (User?). 
            // In schema: student User @relation(fields: [studentId], references: [id])
            // So studentId IS userId. Correct.
            // instructorId: cls.instructorId, // Removed: Not in Booking Schema
            status: "PENDING",
            price: cls.fixedPrice ?? cls.pricePerHour ?? 0,
            scheduledTime: scheduledTimeStr ? new Date(scheduledTimeStr) : new Date(),
        }
    });

    await logAuditAction({
        action: "BOOKING_INITIATED",
        entityType: "Booking",
        entityId: booking.id,
        actor: { id: user.id, role: user.role, email: user.email ?? undefined },
        status: "SUCCESS",
        metadata: { classId: cls.id, price: cls.fixedPrice ?? cls.pricePerHour ?? 0 }
    });

    // Initiate Checkout
    const session = await PaymentService.getProvider().createCheckoutSession({
        userId: user.id,
        bookingId: booking.id,
        classId: cls.id,
        amount: Math.round((cls.fixedPrice ?? cls.pricePerHour ?? 0) * 100), // Cents
        currency: "USD", // Default
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/student/bookings/success?bookingId=${booking.id}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/classes/${cls.id}`,
        customerEmail: user.email || undefined,
        customerName: user.name || undefined,
    });

    if (session?.url) {
        redirect(session.url);
    } else {
        return { error: "Failed to initiate payment" };
    }
}
