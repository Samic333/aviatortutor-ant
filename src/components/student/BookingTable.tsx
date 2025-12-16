"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Eye, AlertCircle } from "lucide-react";

interface BookingTableProps {
    bookings: any[]; // relaxed type for now
}

export function BookingTable({ bookings }: BookingTableProps) {
    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
                <p className="text-muted-foreground">No bookings found in this category.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 font-medium border-b hidden md:table-header-group">
                    <tr>
                        <th className="px-4 py-3">Class / Instructor</th>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y bg-white">
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 flex flex-col md:table-row">
                            <td className="px-4 py-3">
                                <div className="font-medium text-blue-900">{booking.class.title}</div>
                                <div className="text-xs text-muted-foreground">{booking.class.instructor.user.name}</div>
                            </td>
                            <td className="px-4 py-3">
                                {booking.scheduledTime ? (
                                    <div>
                                        <div>{new Date(booking.scheduledTime).toLocaleDateString()}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(booking.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground italic">Not scheduled</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1 items-start">
                                    <Badge
                                        variant={booking.status === "CONFIRMED" ? "default" : booking.status === "COMPLETED" ? "secondary" : booking.status === "CANCELLED" ? "destructive" : "outline"}
                                    >
                                        {booking.status}
                                    </Badge>
                                    {booking.paymentStatus === "PAID" && (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px]">
                                            Paid
                                        </Badge>
                                    )}
                                    {booking.paymentStatus === "PENDING" && booking.status !== "CANCELLED" && (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-[10px]">
                                            Payment Pending
                                        </Badge>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right flex items-center justify-end gap-2 md:table-cell">
                                {booking.paymentStatus === "PENDING" && booking.status !== "CANCELLED" && (
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8" asChild>
                                        <Link href={`/student/bookings/${booking.id}/payment`}>
                                            Pay Now
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" title="View Details" asChild>
                                    <Link href={`/student/bookings/${booking.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                {booking.status !== "CANCELLED" && (
                                    /* Messaging disabled for now */
                                    <Button variant="ghost" size="icon" title="Message Instructor" disabled className="opacity-50 cursor-not-allowed">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                )}
                                {booking.status === "COMPLETED" && (
                                    <Button variant="ghost" size="icon" title="Dispute">
                                        <AlertCircle className="h-4 w-4 text-orange-500" />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
