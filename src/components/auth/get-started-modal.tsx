"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { AuthSelection } from "./AuthSelection";

interface GetStartedModalProps extends ButtonProps {
    children?: React.ReactNode;
    defaultView?: "CHOICE" | "FORM";
    defaultRole?: "STUDENT" | "INSTRUCTOR";
}

export function GetStartedModal({ children, ...props }: GetStartedModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button {...props}>
                    {children || "Get Started"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl p-8">
                {/* DialogHeader is handled inside AuthSelection for dynamic titles, or we can wrap it here if preferred. 
                     AuthSelection has its own header logic now. */}
                <AuthSelection defaultRole={props.defaultRole} defaultView={props.defaultView} />
            </DialogContent>
        </Dialog>
    );
}
