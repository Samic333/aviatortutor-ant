"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    goalSummary: z.string().max(500, "Goal summary too long"),
    targetLicense: z.string().max(100, "License name too long"),
});

export async function updateStudentProfile(data: z.infer<typeof profileSchema>) {
    const user = await getCurrentUser();

    if (!user || user.role !== "STUDENT") {
        return { error: "Unauthorized" };
    }

    const result = profileSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await prisma.studentProfile.upsert({
            where: { userId: user.id },
            update: {
                goalSummary: data.goalSummary,
                targetLicense: data.targetLicense
            },
            create: {
                userId: user.id,
                goalSummary: data.goalSummary,
                targetLicense: data.targetLicense
            }
        });

        revalidatePath("/student/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }
}
