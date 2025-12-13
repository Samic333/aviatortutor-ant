import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentService } from "@/lib/payments";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("stripe-signature") || req.headers.get("verif-hash") || "";

        const result = await PaymentService.getProvider().handleWebhook(payload, signature);

        if (!result) {
            return new NextResponse("Invalid signature or payload", { status: 400 });
        }

        const { event, data } = result;

        console.log(`[Webhook] Received event: ${event}`, data);

        // Handle successful payment
        if (event === "checkout.session.completed" || event === "charge.completed" || event === "successful") {
            // Stripe: data.metadata.bookingId
            // Flutterwave: data.tx_ref (if passed as bookingId)
            const bookingId = data.metadata?.bookingId || data.tx_ref;

            if (bookingId) {
                console.log(`[Webhook] Confirming booking ${bookingId}`);
                await prisma.booking.update({
                    where: { id: bookingId },
                    data: { status: "CONFIRMED" } // or PAID
                });
            } else {
                console.warn("[Webhook] No bookingId fround in metadata/tx_ref");
            }
        }

        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("[Webhook] Handler failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
