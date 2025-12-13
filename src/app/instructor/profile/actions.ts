"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    yearsExperience: z.coerce.number().min(0, "Experience must be positive"),
    hourlyRate: z.coerce.number().min(0, "Rate must be positive"),
});

export async function updateInstructorProfile(data: z.infer<typeof profileSchema>) {
    const user = await getCurrentUser();

    if (!user || user.role !== "INSTRUCTOR") {
        return { error: "Unauthorized" };
    }

    const result = profileSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    try {
        await prisma.instructorProfile.upsert({
            where: { userId: user.id },
            update: {
                bio: data.bio,
                yearsOfExperience: data.yearsExperience,
                hourlyRateDefault: data.hourlyRate
            },
            create: {
                userId: user.id,
                bio: data.bio,
                yearsOfExperience: data.yearsExperience,
                hourlyRateDefault: data.hourlyRate
            }
        });

        revalidatePath("/instructor/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }
}
