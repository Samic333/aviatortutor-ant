import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";
import { logAuditAction } from "@/lib/audit";

const bookingSchema = z.object({
    classId: z.string(),
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "STUDENT") {
            return NextResponse.json({ message: "Unauthorized: Only students can book" }, { status: 403 });
        }

        const body = await req.json();
        const { classId } = bookingSchema.parse(body);

        const classItem = await prisma.class.findUnique({ where: { id: classId } });
        if (!classItem) {
            return NextResponse.json({ message: "Class not found" }, { status: 404 });
        }

        if (classItem.status !== "PUBLISHED") {
            return NextResponse.json({ message: "Class is not active" }, { status: 400 });
        }

        // Create Booking
        const booking = await prisma.booking.create({
            data: {
                classId,
                studentId: user.id,
                status: "PENDING",
                paymentStatus: "PENDING",
                price: classItem.fixedPrice || classItem.pricePerHour || 0,
                currency: "USD",
                scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // Stub: tomorrow
            }
        });

        await logAuditAction({
            action: "BOOKING_INITIATED",
            entityType: "Booking",
            entityId: booking.id,
            actor: { id: user.id, role: user.role, email: user.email ?? undefined },
            status: "SUCCESS",
            metadata: { classId: classId }
        });

        return NextResponse.json({ id: booking.id, message: "Booking initiated. Please complete payment." }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
