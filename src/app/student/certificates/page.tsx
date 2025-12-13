import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

export default function CertificatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
                <div className="text-center py-16">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Award className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-2">No Certificates Yet</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                        Complete a class with an authorized instructor to earn your first certificate.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/student/classes">Browse Classes</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
