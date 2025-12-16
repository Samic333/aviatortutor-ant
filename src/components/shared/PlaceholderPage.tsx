import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
    title: string;
    description?: string;
    backLink?: string;
    backLabel?: string;
}

export default function PlaceholderPage({
    title,
    description = "This feature is currently under development.",
    backLink = "/",
    backLabel = "Go Back"
}: PlaceholderPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center border-2 border-dashed rounded-lg bg-gray-50/50">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Construction className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                {description}
            </p>
            <Button asChild>
                <Link href={backLink}>{backLabel}</Link>
            </Button>
        </div>
    );
}
