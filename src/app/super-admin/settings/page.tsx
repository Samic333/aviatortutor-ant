import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getSystemSettings } from "./actions";
import { PlatformSettingsForm } from "@/components/super-admin/PlatformSettingsForm";

export default async function SuperAdminSettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    const settings = await getSystemSettings();

    // Default fallback if DB fetch fails or no settings yet
    const initialSettings = settings || {
        platformName: "AviatorTutor",
        supportEmail: "support@aviatortutor.com",
        defaultCurrency: "USD",
        maintenanceMode: false
    };

    return (
        <div className="space-y-6">
            <PlatformSettingsForm initialSettings={{
                platformName: initialSettings.platformName,
                supportEmail: initialSettings.supportEmail,
                defaultCurrency: initialSettings.defaultCurrency,
                maintenanceMode: initialSettings.maintenanceMode
            }} />
        </div>
    );
}
