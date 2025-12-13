import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AuditLogsPage({
    searchParams
}: {
    searchParams: { page?: string, action?: string, actor?: string }
}) {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "SUPER_ADMIN", "OWNER"].includes(user.role)) {
        redirect("/");
    }

    const page = Number(searchParams.page) || 1;
    const take = 20;
    const skip = (page - 1) * take;

    // Build filter
    const where: any = {};
    if (searchParams.action) {
        where.action = { contains: searchParams.action, mode: 'insensitive' };
    }
    if (searchParams.actor) {
        where.OR = [
            { actorId: { contains: searchParams.actor } },
            { actorRole: { contains: searchParams.actor, mode: 'insensitive' } }
        ];
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        }),
        prisma.auditLog.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">System-wide audit trail for security and operations.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Log Entries</CardTitle>
                    <CardDescription>
                        Displaying {logs.length} of {total} records.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-3 font-medium">Time (UTC)</th>
                                    <th className="p-3 font-medium">Actor</th>
                                    <th className="p-3 font-medium">Action</th>
                                    <th className="p-3 font-medium">Entity</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/50">
                                        <td className="p-3 whitespace-nowrap">
                                            {new Date(log.createdAt).toISOString().split('T')[0]} <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium">{log.actorRole}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{log.actorId ? log.actorId.slice(0, 8) + '...' : 'System'}</div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline" className="font-mono text-xs">{log.action}</Badge>
                                        </td>
                                        <td className="p-3">
                                            <div>{log.entityType}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{log.entityId ? log.entityId.slice(0, 8) + '...' : '-'}</div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <details className="cursor-pointer text-xs text-muted-foreground">
                                                <summary>JSON</summary>
                                                <pre className="mt-2 p-2 bg-slate-950 text-slate-50 rounded overflow-x-auto max-w-xs">
                                                    {log.metadata ? JSON.stringify(log.metadata, null, 2) : '{}'}
                                                </pre>
                                            </details>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <Link href={`/admin/logs?page=${page - 1}`} className="px-3 py-1 border rounded text-sm">
                                    Previous
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link href={`/admin/logs?page=${page + 1}`} className="px-3 py-1 border rounded text-sm">
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
