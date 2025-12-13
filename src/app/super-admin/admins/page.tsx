import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { AddAdminModal } from "@/components/super-admin/AddAdminModal";

export default async function SuperAdminAdminsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
                    <p className="text-muted-foreground">Manage administrative users and permissions</p>
                </div>
                <AddAdminModal />
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Joined</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="px-4 py-3 font-medium">{admin.name || "Unnamed"}</td>
                                    <td className="px-4 py-3">{admin.email}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                                            {admin.role}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">{new Date(admin.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost">Edit</Button>
                                            {admin.role === "ADMIN" && (
                                                <Button size="sm" variant="destructive">Revoke</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
