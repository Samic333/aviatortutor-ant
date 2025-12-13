"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Class, ClassType } from "@prisma/client"; // Ensure type import works or define locally

// Reusing schema but expanding for edit
const formSchema = z.object({
    title: z.string().min(5),
    shortDescription: z.string().optional(),
    detailedDescription: z.string().optional(),
    type: z.enum(["ONE_ON_ONE", "GROUP", "CHAT"]),
    pricePerHour: z.coerce.number().optional(),
    fixedPrice: z.coerce.number().optional(),
    maxSeats: z.coerce.number().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "PENDING_REVIEW"]),
});

interface EditClassFormProps {
    classItem: Class; // Using Prisma type
}

export function EditClassForm({ classItem }: EditClassFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: classItem.title,
            shortDescription: classItem.shortDescription || "",
            detailedDescription: classItem.detailedDescription || "",
            type: classItem.type,
            pricePerHour: classItem.pricePerHour || undefined,
            fixedPrice: classItem.fixedPrice || undefined,
            maxSeats: classItem.maxSeats || undefined,
            status: classItem.status
        }
    });

    const type = watch("type");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/classes/${classItem.id}`, {
                method: "PUT",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Failed");
            router.refresh();
            router.push("/instructor/classes");
        } catch (e) {
            alert("Error updating class");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-6 rounded-lg border">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Edit Class Details</h3>
                <div className="flex items-center gap-2">
                    <Label>Status</Label>
                    <select {...register("status")} className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                        <option value="DRAFT">Draft</option>
                        <option value="PENDING_REVIEW">Pending Review</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Class Title</Label>
                <Input {...register("title")} placeholder="e.g. Advanced IFR Training" />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>

            <div className="space-y-2">
                <Label>Type</Label>
                <select {...register("type")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="ONE_ON_ONE">1-on-1 Session</option>
                    <option value="GROUP">Group Class (Live)</option>
                    <option value="CHAT">Chat Consultation</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label>Short Description</Label>
                <textarea {...register("shortDescription")} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {type === 'ONE_ON_ONE' ? (
                    <div className="space-y-2">
                        <Label>Hourly Rate ($)</Label>
                        <Input type="number" {...register("pricePerHour")} placeholder="50" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Fixed Price ($)</Label>
                        <Input type="number" {...register("fixedPrice")} placeholder="100" />
                    </div>
                )}

                {type === 'GROUP' && (
                    <div className="space-y-2">
                        <Label>Max Seats</Label>
                        <Input type="number" {...register("maxSeats")} placeholder="10" />
                    </div>
                )}
            </div>

            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Update Class"}</Button>
        </form>
    );
}
