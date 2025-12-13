import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPaymentProvider, isPaymentConfigured } from "@/lib/payments";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!isPaymentConfigured()) {
            return NextResponse.json(
                { error: "Payment integration not configured" },
                { status: 503 }
            );
        }

        const body = await req.json();
        const { bookingId, classId, amount, currency = "USD" } = body;

        if (!bookingId || !classId || !amount) {
            return NextResponse.json(
                { error: "Missing required fields: bookingId, classId, amount" },
                { status: 400 }
            );
        }

        // Verify booking belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { class: true },
        });

        if (!booking || booking.studentId !== session.user.id) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const provider = getPaymentProvider();
        const origin = process.env.NEXTAUTH_URL || process.env.APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
        if (!origin) {
            console.error("[Checkout] Error: NEXTAUTH_URL or APP_URL not set");
            return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }

        const result = await provider.createCheckoutSession({
            userId: session.user.id,
            bookingId,
            classId,
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            successUrl: `${origin}/student/bookings?payment=success&booking=${bookingId}`,
            cancelUrl: `${origin}/student/bookings?payment=cancelled&booking=${bookingId}`,
        });

        if (!result) {
            return NextResponse.json(
                { error: "Failed to create checkout session" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            sessionId: result.sessionId,
            url: result.url,
        });
    } catch (error) {
        console.error("[Checkout] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
