import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("stripe-signature") || "";

        const provider = getPaymentProvider();
        const result = await provider.handleWebhook(payload, signature);

        if (!result) {
            console.warn("[Webhook] Unverified or unsupported event");
            return NextResponse.json({ received: true });
        }

        console.log("[Webhook] Event:", result.event);

        // Handle specific events
        if (result.event === "checkout.session.completed") {
            const session = result.data;
            const bookingId = session.metadata?.bookingId;

            if (bookingId) {
                await prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        paymentStatus: "PAID",
                        status: "CONFIRMED",
                    },
                });
                console.log("[Webhook] Booking confirmed:", bookingId);
            }
        }

        if (result.event === "charge.refunded") {
            const charge = result.data;
            const bookingId = charge.metadata?.bookingId;

            if (bookingId) {
                await prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        paymentStatus: "REFUNDED",
                    },
                });
                console.log("[Webhook] Booking refunded:", bookingId);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Webhook] Error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}


