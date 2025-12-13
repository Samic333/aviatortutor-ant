import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ComingSoonProps {
    title?: string;
    description?: string;
    backLink?: string;
    backText?: string;
}

export function ComingSoon({
    title = "Coming Soon",
    description = "We are working hard to bring this feature to life. Check back later!",
    backLink = "/",
    backText = "Go Home"
}: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <Construction className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                {description}
            </p>
            <Button asChild>
                <Link href={backLink}>{backText}</Link>
            </Button>
        </div>
    );
}
