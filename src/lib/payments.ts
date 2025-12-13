/**
 * Payment Integration Service
 * 
 * Abstraction layer supporting Stripe (primary) and Flutterwave (optional).
 * 
 * Required env vars for Stripe:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 * 
 * Optional env vars for Flutterwave:
 * - FLW_PUBLIC_KEY
 * - FLW_SECRET_KEY
 * - FLW_ENCRYPTION_KEY
 * 
 * - PAYMENT_PROVIDER: "stripe" | "flutterwave" (default: stripe)
 */

import Stripe from "stripe";

export interface CheckoutSessionConfig {
    userId: string;
    bookingId: string;
    classId: string;
    amount: number; // in cents
    currency: string;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    customerName?: string;
    metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
    sessionId: string;
    url: string;
}

export interface PaymentProvider {
    createCheckoutSession(config: CheckoutSessionConfig): Promise<CheckoutSessionResult | null>;
    handleWebhook(payload: string, signature: string): Promise<{ event: string; data: any } | null>;
}

// ==================== STRIPE IMPLEMENTATION ====================

const getStripeClient = (): Stripe | null => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        console.warn("[Payments] Stripe not configured");
        return null;
    }
    return new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" } as any);
};

const stripeProvider: PaymentProvider = {
    async createCheckoutSession(config: CheckoutSessionConfig): Promise<CheckoutSessionResult | null> {
        const stripe = getStripeClient();
        if (!stripe) {
            console.warn("[Payments] Stripe not configured. Returning stub.");
            return {
                sessionId: `stub_session_${Date.now()}`,
                url: config.successUrl + "?session_id=stub",
            };
        }

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: config.currency.toLowerCase(),
                            product_data: {
                                name: "Class Booking",
                                description: `Booking ID: ${config.bookingId}`,
                            },
                            unit_amount: config.amount,
                        },
                        quantity: 1,
                    },
                ],
                success_url: config.successUrl,
                cancel_url: config.cancelUrl,
                metadata: {
                    userId: config.userId,
                    bookingId: config.bookingId,
                    classId: config.classId,
                    ...config.metadata,
                },
            });

            return {
                sessionId: session.id,
                url: session.url || config.successUrl,
            };
        } catch (error) {
            console.error("[Payments] Stripe checkout error:", error);
            return null;
        }
    },

    async handleWebhook(payload: string, signature: string): Promise<{ event: string; data: any } | null> {
        const stripe = getStripeClient();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripe || !webhookSecret) {
            console.warn("[Payments] Webhook not configured");
            return null;
        }

        try {
            const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            return {
                event: event.type,
                data: event.data.object,
            };
        } catch (error) {
            console.error("[Payments] Webhook verification failed:", error);
            return null;
        }
    },
};

// ==================== FLUTTERWAVE STUB ====================

const flutterwaveProvider: PaymentProvider = {
    async createCheckoutSession(config: CheckoutSessionConfig): Promise<CheckoutSessionResult | null> {
        const secretKey = process.env.FLW_SECRET_KEY;
        if (!secretKey) {
            console.warn("[Payments] Flutterwave Secret Key not configured");
            return null;
        }

        try {
            const response = await fetch("https://api.flutterwave.com/v3/payments", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tx_ref: config.bookingId,
                    amount: config.amount / 100, // Amount in main currency unit (not cents)
                    currency: config.currency,
                    redirect_url: config.successUrl,
                    customer: {
                        email: config.customerEmail || "user@example.com",
                        name: config.customerName || `User ${config.userId}`,
                    },
                    customizations: {
                        title: "Class Booking",
                        description: `Booking for Class ${config.classId}`,
                        logo: "https://your-logo-url.com/logo.png", // Optional
                    },
                    meta: {
                        classId: config.classId,
                        userId: config.userId,
                        bookingId: config.bookingId,
                        ...config.metadata,
                    }
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                return {
                    sessionId: config.bookingId,
                    url: data.data.link,
                };
            } else {
                console.error("[Payments] Flutterwave error:", data);
                return null;
            }

        } catch (error) {
            console.error("[Payments] Flutterwave request failed:", error);
            return null;
        }
    },

    async handleWebhook(payload: string, signature: string): Promise<{ event: string; data: any } | null> {
        // Basic verification using secret hash if configured
        const secretHash = process.env.FLW_SECRET_HASH;
        if (secretHash && signature !== secretHash) {
            console.warn("[Payments] Invalid Flutterwave signature");
            return null;
        }

        // Flutterwave Payload structure isn't exactly 'event' based like Stripe in the same way,
        // but typically has 'event' field or just data.
        // Assuming we parse the JSON payload.
        try {
            const body = JSON.parse(payload);
            return {
                event: body.event || "charge.completed", // Default or extracted
                data: body.data,
            };
        } catch (e) {
            return null;
        }
    },
};

// ==================== PROVIDER SELECTION ====================

export function getPaymentProvider(): PaymentProvider {
    const provider = process.env.PAYMENT_PROVIDER || "stripe";

    if (provider === "flutterwave") {
        return flutterwaveProvider;
    }

    return stripeProvider;
}

export function isPaymentConfigured(): boolean {
    const provider = process.env.PAYMENT_PROVIDER || "stripe";

    if (provider === "flutterwave") {
        return !!(process.env.FLW_SECRET_KEY && process.env.FLW_PUBLIC_KEY);
    }

    return !!process.env.STRIPE_SECRET_KEY;
}

export const PaymentService = {
    getProvider: getPaymentProvider,
    isConfigured: isPaymentConfigured,
};

export default PaymentService;
