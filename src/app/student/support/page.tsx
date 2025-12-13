import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { CreateTicketForm } from "@/components/student/CreateTicketForm";

export default async function StudentSupportPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const tickets = await prisma.supportTicket.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: 'desc' },
        include: { booking: { include: { class: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support & Disputes</h1>
                    <p className="text-muted-foreground">Get help with your classes or account.</p>
                </div>
                <CreateTicketForm />
            </div>

            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-muted-foreground">No support tickets found.</p>
                        </CardContent>
                    </Card>
                ) : (
                    tickets.map(ticket => (
                        <Card key={ticket.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={ticket.status === "OPEN" ? "default" : ticket.status === "RESOLVED" ? "secondary" : "outline"}>
                                            {ticket.status}
                                        </Badge>
                                        <span className="font-semibold text-lg">Ticket #{ticket.id.slice(-4).toUpperCase()}</span>
                                    </div>
                                    <CardDescription>
                                        Created on {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.type}
                                    </CardDescription>
                                </div>
                                {/* <Button variant="ghost" size="sm">View Thread</Button> */}
                            </CardHeader>
                            <CardContent>
                                {ticket.booking && (
                                    <div className="bg-gray-50 p-2 rounded text-sm mb-2">
                                        Related to: <span className="font-medium">{ticket.booking.class.title}</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-700">
                                    (Ticket messages would appear here)
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
