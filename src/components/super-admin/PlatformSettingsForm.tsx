"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSystemSettings } from "@/app/super-admin/settings/actions";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SettingsFormProps {
    initialSettings: {
        platformName: string;
        supportEmail: string;
        defaultCurrency: string;
        maintenanceMode: boolean;
    };
}

export function PlatformSettingsForm({ initialSettings }: SettingsFormProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateSystemSettings(settings);
        setIsLoading(false);

        if (result.success) {
            toast.success("Settings saved successfully.");
        } else {
            toast.error(result.error || "Failed to save settings.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                    <p className="text-muted-foreground">Configure global platform parameters</p>
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Platform Name</Label>
                        <Input
                            value={settings.platformName}
                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Support Email</Label>
                        <Input
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Default Currency</Label>
                        <Select
                            value={settings.defaultCurrency}
                            onValueChange={(val) => setSettings({ ...settings, defaultCurrency: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
