import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default async function AdminSupportPage() {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        redirect("/");
    }

    const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { createdBy: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage support requests and disputes</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Inbox className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg">No Tickets Found</h3>
                            <p className="text-muted-foreground">There are no support tickets matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1 mb-2 md:mb-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={ticket.status === "OPEN" ? "destructive" : ticket.status === "RESOLVED" ? "secondary" : "default"}>
                                                {ticket.status}
                                            </Badge>
                                            <Badge variant="outline">{ticket.priority}</Badge>
                                            <span className="text-sm text-muted-foreground">#{ticket.id.slice(-4).toUpperCase()}</span>
                                        </div>
                                        <h3 className="font-semibold">{ticket.subject || "No Subject"}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            From {ticket.createdBy.name} • {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/admin/support/${ticket.id}`}>Manage</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
