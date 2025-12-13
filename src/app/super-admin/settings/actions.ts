"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateSystemSettings(data: {
    platformName: string;
    supportEmail: string;
    defaultCurrency: string;
    maintenanceMode: boolean;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // Upsert settings (assuming single row)
        // Since we don't have a singleton ID, we find first or create
        const existing = await prisma.systemSettings.findFirst();

        if (existing) {
            await prisma.systemSettings.update({
                where: { id: existing.id },
                data
            });
        } else {
            await prisma.systemSettings.create({
                data
            });
        }

        revalidatePath("/super-admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating settings:", error);
        return { error: "Failed to update settings" };
    }
}

export async function getSystemSettings() {
    // Public or protected? Usually protected slightly.
    // For this page, we assume user is already checked in page.tsx
    try {
        let settings = await prisma.systemSettings.findFirst();
        if (!settings) {
            // Return defaults if not found
            return {
                platformName: "AviatorTutor",
                supportEmail: "support@aviatortutor.com",
                defaultCurrency: "USD",
                maintenanceMode: false
            };
        }
        return settings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
    }
}
