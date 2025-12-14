import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Activity, Users, BookOpen, AlertTriangle } from "lucide-react";

export default async function OwnerOperationsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [userStats, classStats, systemHealth] = await Promise.all([
        prisma.user.groupBy({
            by: ['role'],
            _count: true
        }),
        prisma.class.groupBy({
            by: ['status'],
            _count: true
        }),
        // Mock system health data
        Promise.resolve({
            uptime: "99.9%",
            activeConnections: 1247,
            avgResponseTime: "45ms",
            errorRate: "0.02%"
        })
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    OPERATIONS CENTER
                </h1>
                <p className="text-purple-300/70 text-sm font-mono">PLATFORM MANAGEMENT & MONITORING</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        USER DISTRIBUTION
                    </h2>
                    <div className="space-y-3">
                        {userStats.map((stat) => (
                            <div key={stat.role} className="flex justify-between items-center pb-3 border-b border-purple-500/20 last:border-0">
                                <span className="text-sm font-mono text-purple-300/80">{stat.role}</span>
                                <span className="text-purple-400 font-bold text-lg">{stat._count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        CLASS STATUS
                    </h2>
                    <div className="space-y-3">
                        {classStats.map((stat) => (
                            <div key={stat.status} className="flex justify-between items-center pb-3 border-b border-cyan-500/20 last:border-0">
                                <span className="text-sm font-mono text-cyan-300/80">{stat.status}</span>
                                <span className="text-cyan-400 font-bold text-lg">{stat._count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    SYSTEM HEALTH
                </h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-xs text-emerald-400 font-mono mb-2">UPTIME</div>
                        <div className="text-2xl font-bold">{systemHealth.uptime}</div>
                    </div>
                    <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                        <div className="text-xs text-cyan-400 font-mono mb-2">ACTIVE SESSIONS</div>
                        <div className="text-2xl font-bold">{systemHealth.activeConnections}</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                        <div className="text-xs text-purple-400 font-mono mb-2">AVG RESPONSE</div>
                        <div className="text-2xl font-bold">{systemHealth.avgResponseTime}</div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <div className="text-xs text-green-400 font-mono mb-2">ERROR RATE</div>
                        <div className="text-2xl font-bold">{systemHealth.errorRate}</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-lg p-6 opacity-50">
                <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    EMERGENCY CONTROLS (Coming Soon)
                </h2>
                <p className="text-sm text-orange-300/60">
                    Advanced system controls are currently disabled for safety.
                </p>
            </div>
        </div>
    );
}
