import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

// Flexible schema to accept what frontend sends
const classSchema = z.object({
    title: z.string().min(5),
    description: z.string().optional(), // Frontend sends 'description'
    shortDescription: z.string().optional(), // DB has 'shortDescription'
    detailedDescription: z.string().optional(),
    type: z.enum(["ONE_ON_ONE", "GROUP", "CHAT"]),
    price: z.coerce.number().optional(), // Frontend sends 'price'
    pricePerHour: z.coerce.number().optional(),
    syllabus: z.string().optional(),
    authority: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "INSTRUCTOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const instructorProfile = await prisma.instructorProfile.findUnique({
            where: { userId: user.id }
        });

        if (!instructorProfile) {
            return NextResponse.json({ message: "Instructor profile not found" }, { status: 404 });
        }

        if (instructorProfile.pendingApproval) {
            return NextResponse.json({ message: "Account pending approval" }, { status: 403 });
        }


        const body = await req.json();
        const data = classSchema.parse(body);

        let detailedDesc = data.detailedDescription || "";
        if (data.syllabus) {
            detailedDesc += "\n\n## Syllabus\n" + data.syllabus;
        }

        const newClass = await prisma.class.create({
            data: {
                instructorId: instructorProfile.id,
                title: data.title,
                shortDescription: data.shortDescription || data.description,
                detailedDescription: detailedDesc,
                type: data.type,
                authority: data.authority,
                pricePerHour: data.price || data.pricePerHour,
                status: "DRAFT"
            }
        });

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error", error: error }, { status: 500 });
    }
}
