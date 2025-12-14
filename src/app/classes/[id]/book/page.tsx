import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { BookingForm } from "./BookingForm";

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

                    <BookingForm classId={cls.id} price={price} />
                </CardContent>
            </Card>
        </div>
    );
}
