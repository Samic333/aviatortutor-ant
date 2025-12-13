"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const classSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    shortDescription: z.string().max(150, "Short description must be under 150 chars"),
    detailedDescription: z.string().optional(),
    type: z.enum(["ONE_ON_ONE", "GROUP", "CHAT"]),
    authority: z.string().min(1, "Please select an authority"),
    authorityStandard: z.string().optional(),
    pricePerHour: z.coerce.number().min(0, "Price must be non-negative"),
    syllabus: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
    initialData?: any;
    classId?: string;
}

export function ClassForm({ initialData, classId }: ClassFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!initialData;

    const { register, handleSubmit, formState: { errors } } = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema) as any,
        defaultValues: initialData ? {
            title: initialData.title,
            shortDescription: initialData.shortDescription || "",
            detailedDescription: initialData.detailedDescription || "",
            type: initialData.type,
            authority: initialData.authority,
            authorityStandard: initialData.authorityStandard || "",
            pricePerHour: initialData.pricePerHour ?? initialData.fixedPrice ?? 0,
            syllabus: "", // Field exists in form but maybe mapped to detailedDescription or ignored?
        } : {
            type: "ONE_ON_ONE",
            pricePerHour: 0
        }
    });

    const onSubmit = async (data: ClassFormValues) => {
        setIsLoading(true);
        try {
            const url = isEditing ? `/api/classes/${classId}` : "/api/classes";
            const method = isEditing ? "PATCH" : "POST";

            const payload = {
                title: data.title,
                shortDescription: data.shortDescription,
                detailedDescription: data.detailedDescription + (data.syllabus ? `\n\nSyllabus:\n${data.syllabus}` : ""),
                type: data.type,
                authority: data.authority,
                authorityStandard: data.authorityStandard,
                pricePerHour: data.pricePerHour,
                // syllabus field removed from payload as not in schema, merged into description above
            };

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save class");
            }

            toast.success(isEditing ? "Class updated successfully" : "Class created successfully");
            router.push("/instructor/classes");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basics" className="w-full">
                <TabsList>
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="basics">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Class Title</label>
                                <Input {...register("title")} placeholder="e.g. A320 Systems Review" />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Short Description</label>
                                <Input {...register("shortDescription")} placeholder="Brief tagline" />
                                {errors.shortDescription && <p className="text-red-500 text-xs">{errors.shortDescription.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("type")}
                                >
                                    <option value="ONE_ON_ONE">1-on-1</option>
                                    <option value="GROUP">Group Class</option>
                                    <option value="CHAT">Chat Only</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Authority (Regulator)</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("authority")}
                                >
                                    <option value="">Select Authority</option>
                                    <option value="FAA">FAA (USA)</option>
                                    <option value="EASA">EASA (Europe)</option>
                                    <option value="UK CAA">UK CAA</option>
                                    <option value="TC">Transport Canada</option>
                                    <option value="CASA">CASA (Australia)</option>
                                    <option value="DGCA">DGCA (India)</option>
                                </select>
                                {errors.authority && <p className="text-red-500 text-xs">{errors.authority.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Standard</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("authorityStandard")}
                                >
                                    <option value="">Select Standard</option>
                                    <option value="ICAO">ICAO</option>
                                    <option value="FAA">FAA</option>
                                    <option value="EASA">EASA</option>
                                    <option value="IATA">IATA</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="curriculum">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Detailed Description</label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("detailedDescription")}
                                    placeholder="Full details about the class..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Syllabus</label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("syllabus")}
                                    placeholder="Weekly breakdown..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pricing">
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Price per Hour (USD)</label>
                                <Input type="number" step="0.01" {...register("pricePerHour")} />
                                <p className="text-xs text-muted-foreground">For 1-on-1 sessions.</p>
                                {errors.pricePerHour && <p className="text-red-500 text-xs">{errors.pricePerHour.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (isEditing ? "Update Class" : "Create Class")}
                </Button>
            </div>
        </form>
    );
}
