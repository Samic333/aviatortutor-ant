import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const airlines = await prisma.airline.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, country: true }
        });
        return NextResponse.json(airlines);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch airlines" }, { status: 500 });
    }
}
