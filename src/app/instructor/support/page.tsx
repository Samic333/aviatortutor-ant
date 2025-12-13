import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { MessageSquare } from "lucide-react";

export default async function InstructorSupportPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const tickets = await prisma.supportTicket.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Instructor Support</h1>
                        <p className="text-muted-foreground">Submit a ticket for technical issues or disputes.</p>
                    </div>
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <SupportTicketForm />
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">Your Tickets</h2>
                    {tickets.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-muted p-4 rounded-full mb-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">No Support Tickets</h3>
                                <p className="text-muted-foreground text-sm max-w-xs">
                                    You haven't submitted any support requests yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {tickets.map(ticket => (
                                <Card key={ticket.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={ticket.status === "OPEN" ? "default" : ticket.status === "RESOLVED" ? "secondary" : "outline"}>
                                                        {ticket.status}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">#{ticket.id.slice(-4).toUpperCase()}</span>
                                                </div>
                                                <CardTitle className="text-base">{ticket.subject || "No Subject"}</CardTitle>
                                            </div>
                                            <Badge variant="outline">{ticket.type}</Badge>
                                        </div>
                                        <CardDescription>
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm line-clamp-2 text-muted-foreground">{ticket.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
