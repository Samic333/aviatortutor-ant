import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export default async function InstructorEarningsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
    });

    if (!instructorProfile) return <div>Profile not found</div>;

    const paidBookings = await prisma.booking.findMany({
        where: {
            class: { instructorId: instructorProfile.id },
            paymentStatus: { in: ["PAID"] }
        },
        orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = paidBookings.reduce((acc, curr) => acc + curr.price, 0);
    // Platform fee calculation could be here (e.g. 10%)
    const platformFee = totalRevenue * 0.1;
    const netEarnings = totalRevenue - platformFee;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
                <p className="text-muted-foreground">Track your revenue and payouts.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${netEarnings.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">After platform fees (10%)</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    {paidBookings.length === 0 ? (
                        <p className="text-muted-foreground">No earnings yet.</p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-medium border-b">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Fee</th>
                                    <th className="px-4 py-3">Net</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paidBookings.map((b) => (
                                    <tr key={b.id}>
                                        <td className="px-4 py-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">${b.price.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-red-500">-${(b.price * 0.1).toFixed(2)}</td>
                                        <td className="px-4 py-3 font-medium text-green-600">${(b.price * 0.9).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
