import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Shield, Users, Settings, DollarSign } from "lucide-react";

export default async function SuperAdminDashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const [totalAdmins, totalRevenue, platformSettings] = await Promise.all([
        prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
        prisma.booking.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { price: true }
        }),
        // Mock settings count
        Promise.resolve(12)
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform-wide control and oversight</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAdmins}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue._sum.price?.toFixed(2) || "0.00"}</div>
                        <p className="text-xs text-muted-foreground">All-time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Settings</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{platformSettings}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Operational</div>
                        <p className="text-xs text-muted-foreground">All systems normal</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Shield className="h-6 w-6 mb-2 text-blue-600" />
                            <h3 className="font-semibold">Manage Admins</h3>
                            <p className="text-sm text-muted-foreground">Add or remove admin privileges</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Settings className="h-6 w-6 mb-2 text-gray-600" />
                            <h3 className="font-semibold">Platform Settings</h3>
                            <p className="text-sm text-muted-foreground">Configure system parameters</p>
                        </div>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <DollarSign className="h-6 w-6 mb-2 text-green-600" />
                            <h3 className="font-semibold">Financial Reports</h3>
                            <p className="text-sm text-muted-foreground">View revenue analytics</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
