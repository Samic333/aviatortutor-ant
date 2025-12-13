import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <div className="container flex max-w-md flex-col items-center text-center">
                <div className="mb-8 rounded-full bg-muted/50 p-6">
                    <Plane className="h-12 w-12 rotate-180 text-muted-foreground" />
                </div>
                <h1 className="mb-4 text-4xl font-bold tracking-tight">Page Not Found</h1>
                <p className="mb-8 text-lg text-muted-foreground">
                    Looks like you've flown off course. The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/support">
                            Contact Support
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
