import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">View and manage all platform users</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
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
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-4 py-3 font-medium">{u.name || "Unnamed"}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline">{u.role}</Badge>
                                        </td>
                                        <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <Button size="sm" variant="ghost" asChild>
                                                <Link href={`/admin/users/${u.id}`}>View</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
