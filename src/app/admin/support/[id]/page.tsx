import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TicketStatusSelect } from "@/components/admin/TicketStatusSelect";

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        redirect("/");
    }

    const ticket = await prisma.supportTicket.findUnique({
        where: { id: params.id },
        include: {
            createdBy: true,
            booking: { include: { class: true } }
        }
    });

    if (!ticket) {
        return <div>Ticket not found</div>;
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/admin/support"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Tickets</Link>
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Ticket #{ticket.id.slice(-4).toUpperCase()}</h1>
                    <div className="flex gap-2">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline">{ticket.priority}</Badge>
                    </div>
                </div>
                <TicketStatusSelect ticketId={ticket.id} currentStatus={ticket.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{ticket.subject || "No Subject"}</CardTitle>
                            <CardDescription>
                                Submitted by {ticket.createdBy.name} on {new Date(ticket.createdAt).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap">
                                {ticket.description}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages would go here */}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium">{ticket.createdBy.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span className="font-medium">{ticket.createdBy.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Role:</span>
                                    <span className="font-medium">{ticket.createdBy.role}</span>
                                </div>
                                <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                                    <Link href={`/admin/users/${ticket.createdBy.id}`}>View Profile</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {ticket.booking && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Booking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="font-medium">{ticket.booking.class.title}</div>
                                    <div className="text-muted-foreground">{new Date(ticket.booking.createdAt).toLocaleDateString()}</div>
                                    <Button size="sm" variant="outline" className="w-full mt-2" disabled>
                                        View Booking (Coming Soon)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
