import { getCurrentUser } from "@/lib/session";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default async function SuperAdminSettingsPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/");

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">Configure global platform parameters</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Platform Name</label>
                        <Input defaultValue="AviatorTutor" disabled />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Support Email</label>
                        <Input defaultValue="support@aviatortutor.com" disabled />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Default Currency</label>
                        <Input defaultValue="USD" disabled />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Platform Fee (%)</label>
                        <Input type="number" defaultValue="10" disabled />
                        <p className="text-xs text-muted-foreground">Percentage taken from each transaction</p>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Payment Provider</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" disabled>
                            <option>Flutterwave</option>
                            <option>Stripe</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Instructor Approval</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Auto-approve instructors</p>
                            <p className="text-sm text-muted-foreground">Skip manual review process</p>
                        </div>
                        <Button variant="outline" size="sm" disabled>Disabled</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button disabled>Save Changes (Coming Soon)</Button>
            </div>
        </div>
    );
}
