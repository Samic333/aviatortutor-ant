import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !["ADMIN", "SUPER_ADMIN", "OWNER"].includes(user.role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const [usersCount, bookingsCount, classesCount] = await Promise.all([
            prisma.user.count(),
            prisma.booking.count(),
            prisma.class.count()
        ]);

        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                student: true,
                class: true
            }
        });

        return NextResponse.json({
            stats: {
                users: usersCount,
                bookings: bookingsCount,
                classes: classesCount,
                revenue: bookingsCount * 100 // Stub revenue
            },
            recentBookings
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
