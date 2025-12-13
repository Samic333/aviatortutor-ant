import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Activity, TrendingUp, Users, DollarSign, Zap, Shield } from "lucide-react";

export default async function OwnerCommandDeckPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [totalUsers, totalRevenue, activeInstructors, totalClasses] = await Promise.all([
        prisma.user.count(),
        prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { price: true }
        }),
        prisma.instructorProfile.count({ where: { pendingApproval: false } }),
        prisma.class.count({ where: { status: "PUBLISHED" } })
    ]);

    const platformFee = (totalRevenue._sum.price || 0) * 0.1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
            {/* Futuristic Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        COMMAND DECK
                    </h1>
                </div>
                <p className="text-cyan-300/70 text-sm font-mono">SYSTEM STATUS: OPERATIONAL • UPTIME: 99.9%</p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-cyan-400 text-xs font-mono uppercase tracking-wider">Total Users</div>
                        <Users className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{totalUsers.toLocaleString()}</div>
                    <div className="text-xs text-cyan-300/60 font-mono">+12.5% vs last month</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-green-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-green-400 text-xs font-mono uppercase tracking-wider">Revenue</div>
                        <DollarSign className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">${(totalRevenue._sum.price || 0).toLocaleString()}</div>
                    <div className="text-xs text-green-300/60 font-mono">Platform Fee: ${platformFee.toFixed(2)}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-purple-400 text-xs font-mono uppercase tracking-wider">Instructors</div>
                        <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{activeInstructors}</div>
                    <div className="text-xs text-purple-300/60 font-mono">Active & Verified</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 hover:border-orange-400/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-orange-400 text-xs font-mono uppercase tracking-wider">Live Classes</div>
                        <Activity className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="text-4xl font-bold mb-1">{totalClasses}</div>
                    <div className="text-xs text-orange-300/60 font-mono">Published & Active</div>
                </div>
            </div>

            {/* System Overview */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        GROWTH METRICS
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                            <span className="text-sm font-mono text-cyan-300/80">User Acquisition Rate</span>
                            <span className="text-green-400 font-bold">+15.2%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                            <span className="text-sm font-mono text-cyan-300/80">Revenue Growth (MoM)</span>
                            <span className="text-green-400 font-bold">+22.8%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/20">
                            <span className="text-sm font-mono text-cyan-300/80">Instructor Retention</span>
                            <span className="text-green-400 font-bold">94.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-mono text-cyan-300/80">Student Satisfaction</span>
                            <span className="text-green-400 font-bold">4.8/5.0</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        SYSTEM HEALTH
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                            <span className="text-sm font-mono text-purple-300/80">API Response Time</span>
                            <span className="text-green-400 font-bold">45ms</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                            <span className="text-sm font-mono text-purple-300/80">Database Load</span>
                            <span className="text-yellow-400 font-bold">62%</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-purple-500/20">
                            <span className="text-sm font-mono text-purple-300/80">Active Sessions</span>
                            <span className="text-green-400 font-bold">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-mono text-purple-300/80">Error Rate</span>
                            <span className="text-green-400 font-bold">0.02%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">QUICK ACTIONS</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg p-4 text-left transition-all transform hover:scale-105">
                        <div className="font-bold mb-1">Financial Reports</div>
                        <div className="text-xs text-cyan-100/70">View detailed analytics</div>
                    </button>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg p-4 text-left transition-all transform hover:scale-105">
                        <div className="font-bold mb-1">Operations Center</div>
                        <div className="text-xs text-purple-100/70">Manage platform ops</div>
                    </button>
                    <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg p-4 text-left transition-all transform hover:scale-105">
                        <div className="font-bold mb-1">Emergency Controls</div>
                        <div className="text-xs text-orange-100/70">Critical actions</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
