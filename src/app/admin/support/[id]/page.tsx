import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Clock, AlertCircle } from "lucide-react";
import { UpdateTicketStatus } from "@/components/admin/UpdateTicketStatus";

export default async function AdminTicketManagePage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OWNER")) {
        redirect("/");
    }

    const ticket = await prisma.supportTicket.findUnique({
        where: { id: params.id },
        include: { createdBy: true }
    });

    if (!ticket) notFound();

    return (
        <div className="space-y-6 max-w-3xl mx-auto py-8">
            <Button variant="ghost" asChild className="mb-4 pl-0">
                <Link href="/admin/support">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tickets
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                            {ticket.type}
                        </Badge>
                        <Badge variant={ticket.priority === "URGENT" || ticket.priority === "HIGH" ? "destructive" : "default"} className="text-xs">
                            {ticket.priority} Priority
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold">{ticket.subject || "No Subject"}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Clock className="h-4 w-4" />
                        <span>Opened {new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <UpdateTicketStatus ticketId={ticket.id} currentStatus={ticket.status} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                                {ticket.description}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Conversation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-gray-50 border p-4 rounded-lg">
                                <p className="text-sm text-center text-muted-foreground italic">
                                    Messaging integration not active. Please reply via email.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">User Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <Link href={`/admin/users/${ticket.createdBy.id}`} className="hover:underline font-medium">
                                    {ticket.createdBy.name}
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="truncate">{ticket.createdBy.email}</span>
                            </div>
                            <div className="pt-2">
                                <Button variant="outline" className="w-full" asChild>
                                    <a href={`mailto:${ticket.createdBy.email}?subject=RE: ${ticket.subject} [Ticket #${ticket.id.slice(-4)}]`}>
                                        Reply via Email
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {ticket.bookingId && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Related Booking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="link" className="p-0 h-auto" asChild>
                                    <Link href={`/admin/bookings/${ticket.bookingId}`}>
                                        View Booking #{ticket.bookingId.slice(-6)}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
