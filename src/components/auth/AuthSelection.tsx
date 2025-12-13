"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plane, ChevronLeft } from "lucide-react";
import { RegisterForm } from "./RegisterForm";

interface AuthSelectionProps {
    onBack?: () => void; // Optional back handler if wrapped in something else
    defaultView?: "CHOICE" | "FORM";
    defaultRole?: "STUDENT" | "INSTRUCTOR";
}

export function AuthSelection({ onBack, defaultView = "CHOICE", defaultRole = "STUDENT" }: AuthSelectionProps) {
    const [view, setView] = useState<"CHOICE" | "FORM">(defaultView);
    const [selectedRole, setSelectedRole] = useState<"STUDENT" | "INSTRUCTOR">(defaultRole);

    const handleRoleSelect = (role: "STUDENT" | "INSTRUCTOR") => {
        setSelectedRole(role);
        setView("FORM");
    };

    const handleBack = () => {
        if (view === "FORM") {
            setView("CHOICE");
        } else if (onBack) {
            onBack();
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 flex items-center justify-center relative">
                {view === "FORM" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0"
                        onClick={() => setView("CHOICE")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {view === "CHOICE" ? "Join AviatorTutor" : selectedRole === "STUDENT" ? "Student Registration" : "Instructor Application"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {view === "CHOICE" ? "Choose your path to get started." : "Fill in your details below."}
                    </p>
                </div>
            </div>

            {view === "CHOICE" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                    <button
                        onClick={() => handleRoleSelect("STUDENT")}
                        className="flex flex-col items-center p-8 border rounded-2xl hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer text-center space-y-5 bg-card hover:shadow-lg h-full group"
                    >
                        <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">I'm a Student</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed px-2">
                                Book sessions, learn from experts, and advance your career.
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect("INSTRUCTOR")}
                        className="flex flex-col items-center p-8 border rounded-2xl hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer text-center space-y-5 bg-card hover:shadow-lg h-full group"
                    >
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                            <Plane className="h-8 w-8 rotate-[-45deg]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors">I'm an Instructor</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed px-2">
                                Teach, mentor students, and earn money sharing your expertise.
                            </p>
                        </div>
                    </button>
                </div>
            ) : (
                <RegisterForm role={selectedRole} onSuccess={() => window.location.reload()} />
            )}
        </div>
    );
}
