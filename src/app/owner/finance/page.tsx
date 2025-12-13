import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default async function OwnerFinancePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [totalRevenue, monthlyRevenue, transactions] = await Promise.all([
        prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { price: true },
            _count: true
        }),
        prisma.booking.aggregate({
            where: {
                paymentStatus: "PAID",
                createdAt: { gte: new Date(new Date().setDate(1)) }
            },
            _sum: { price: true }
        }),
        prisma.booking.findMany({
            where: { paymentStatus: "PAID" },
            include: { class: { include: { instructor: { include: { user: true } } } }, student: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    ]);

    const platformFee = (totalRevenue._sum.price || 0) * 0.1;
    const monthlyPlatformFee = (monthlyRevenue._sum.price || 0) * 0.1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                    FINANCIAL COMMAND CENTER
                </h1>
                <p className="text-emerald-300/70 text-sm font-mono">REAL-TIME REVENUE ANALYTICS</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-emerald-400 text-xs font-mono uppercase">Total Revenue</div>
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">${(totalRevenue._sum.price || 0).toLocaleString()}</div>
                    <div className="text-xs text-emerald-300/60 font-mono">{totalRevenue._count} transactions</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-cyan-400 text-xs font-mono uppercase">Platform Fees</div>
                        <TrendingUp className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">${platformFee.toLocaleString()}</div>
                    <div className="text-xs text-cyan-300/60 font-mono">10% commission</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-purple-400 text-xs font-mono uppercase">This Month</div>
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">${(monthlyRevenue._sum.price || 0).toLocaleString()}</div>
                    <div className="text-xs text-purple-300/60 font-mono">Fee: ${monthlyPlatformFee.toFixed(2)}</div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-emerald-400">TRANSACTION LOG</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b border-emerald-500/20">
                            <tr className="text-emerald-400 font-mono text-xs">
                                <th className="px-4 py-3 text-left">DATE</th>
                                <th className="px-4 py-3 text-left">STUDENT</th>
                                <th className="px-4 py-3 text-left">INSTRUCTOR</th>
                                <th className="px-4 py-3 text-left">CLASS</th>
                                <th className="px-4 py-3 text-right">AMOUNT</th>
                                <th className="px-4 py-3 text-right">FEE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-500/10">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-emerald-500/5">
                                    <td className="px-4 py-3 font-mono text-xs">{new Date(txn.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{txn.student.name}</td>
                                    <td className="px-4 py-3">{txn.class.instructor.user.name}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{txn.class.title}</td>
                                    <td className="px-4 py-3 text-right font-bold">${txn.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-emerald-400">${(txn.price * 0.1).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
