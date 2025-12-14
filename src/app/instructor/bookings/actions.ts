"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "CANCELLED") {
    const user = await getCurrentUser();
    if (!user || user.role !== "INSTRUCTOR") {
        return { error: "Unauthorized" };
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { class: { include: { instructor: true } } }
    });

    if (!booking || booking.class.instructor.userId !== user.id) {
        return { error: "Booking not found or unauthorized" };
    }

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        });

        revalidatePath("/instructor/bookings");
        revalidatePath("/instructor");

        return { success: true };
    } catch (error) {
        console.error("Error updating booking:", error);
        return { error: "Failed to update status" };
    }
}
