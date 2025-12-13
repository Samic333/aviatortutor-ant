import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StubProps {
    title?: string;
    description?: string;
}

export function Stub({ title = "Coming Soon", description = "This feature is currently under development. Check back later for updates." }: StubProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] border rounded-lg bg-card p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
                {description}
            </p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    );
}
