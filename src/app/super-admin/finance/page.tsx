import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";

export default async function SuperAdminFinancePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [totalRevenue, platformFees, recentTransactions] = await Promise.all([
        prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { price: true },
            _count: true
        }),
        prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { price: true }
        }),
        prisma.booking.findMany({
            where: { paymentStatus: "PAID" },
            include: { class: true, student: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);

    const platformFeeAmount = (platformFees._sum.price || 0) * 0.1;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
                <p className="text-muted-foreground">Platform revenue and transaction analytics</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue._sum.price?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-muted-foreground">{totalRevenue._count} transactions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Fees (10%)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${platformFeeAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Our earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Instructor Payouts</CardTitle>
                        <CreditCard className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${((totalRevenue._sum.price || 0) - platformFeeAmount).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">To be distributed</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Student</th>
                                <th className="px-4 py-3 text-left">Class</th>
                                <th className="px-4 py-3 text-left">Amount</th>
                                <th className="px-4 py-3 text-left">Platform Fee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentTransactions.map((txn) => (
                                <tr key={txn.id}>
                                    <td className="px-4 py-3">{new Date(txn.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{txn.student.name}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{txn.class.title}</td>
                                    <td className="px-4 py-3 font-medium">${txn.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-green-600">${(txn.price * 0.1).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
