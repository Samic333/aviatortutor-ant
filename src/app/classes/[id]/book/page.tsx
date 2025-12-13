import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookingAndCheckout } from "./actions";

export default async function BookingPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/auth/signin?callbackUrl=/classes/${params.id}/book`);
    }

    const cls = await prisma.class.findUnique({
        where: { id: params.id },
        include: { instructor: { include: { user: true } } }
    });

    if (!cls) notFound();

    // Always require time selection for now as Class doesn't have a specific startDate in schema
    const price = cls.fixedPrice ?? cls.pricePerHour ?? 0;

    return (
        <div className="container max-w-lg py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Confirm Booking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">{cls.title}</h3>
                        <p className="text-muted-foreground">{cls.instructor.user.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>1 hr</span> {/* Default duration as placeholder */}
                        </div>
                        <div className="text-right font-bold text-lg">
                            ${price}
                        </div>
                    </div>

                    <form action={createBookingAndCheckout as any}>
                        <input type="hidden" name="classId" value={cls.id} />

                        <div className="space-y-2 mb-4">
                            <Label htmlFor="scheduledTime">Requested Date & Time</Label>
                            <Input
                                type="datetime-local"
                                name="scheduledTime"
                                id="scheduledTime"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <span>Total</span>
                                <span className="font-bold text-xl">${price}</span>
                            </div>
                            <Button type="submit" className="w-full" size="lg">
                                Proceed to Payment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
