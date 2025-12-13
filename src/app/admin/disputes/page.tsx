import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function AdminDisputesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const tickets = await prisma.supportTicket.findMany({
        include: {
            createdBy: true,
            booking: { include: { class: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Disputes & Support</h1>
                <p className="text-muted-foreground">Manage support tickets and resolve disputes</p>
            </div>

            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No support tickets found
                        </CardContent>
                    </Card>
                ) : (
                    tickets.map((ticket) => (
                        <Card key={ticket.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">
                                            Ticket #{ticket.id.slice(-6).toUpperCase()}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            From: {ticket.createdBy.name} ({ticket.createdBy.email})
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant={ticket.type === "DISPUTE" ? "destructive" : "default"}>
                                            {ticket.type}
                                        </Badge>
                                        <Badge variant={ticket.status === "OPEN" ? "default" : "secondary"}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {ticket.booking && (
                                    <p className="text-sm mb-2">
                                        <strong>Related Class:</strong> {ticket.booking.class.title}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground mb-4">
                                    Created: {new Date(ticket.createdAt).toLocaleString()}
                                </p>
                                <div className="flex gap-2">
                                    <Button size="sm">View Details</Button>
                                    {ticket.status === "OPEN" && (
                                        <>
                                            <Button size="sm" variant="outline">Assign to Me</Button>
                                            <Button size="sm" variant="secondary">Resolve</Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
