"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const authMode = searchParams.get("auth"); // "signin" | "signup" | null
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Redirect based on role
            const role = (session.user as any).role;
            if (role === "ADMIN") router.push("/admin");
            else if (role === "SUPER_ADMIN") router.push("/super-admin");
            else if (role === "OWNER") router.push("/owner");
            else if (role === "INSTRUCTOR") router.push("/instructor");
            else router.push("/student");

            setIsOpen(false);
        }
    }, [status, session, router]);

    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    useEffect(() => {
        if (authMode === "signin" || authMode === "signup") {
            setMode(authMode);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [authMode]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Remove query param without refreshing
            const params = new URLSearchParams(searchParams.toString());
            params.delete("auth");
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    const handleTabChange = (value: string) => {
        setMode(value as "signin" | "signup");
        // Optionally update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set("auth", value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <Tabs value={mode} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Get Started</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
