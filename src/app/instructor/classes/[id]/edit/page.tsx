import { ClassForm } from "@/components/instructor/ClassForm";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";

export default async function EditClassPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "INSTRUCTOR") {
        redirect("/");
    }

    const classItem = await prisma.class.findUnique({
        where: { id: params.id },
        include: { instructor: true }
    });

    if (!classItem) {
        notFound();
    }

    // Ensure the instructor owns this class
    if (classItem.instructor.userId !== user.id) {
        redirect("/instructor/classes");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
                <p className="text-muted-foreground">Update your class details.</p>
            </div>
            <ClassForm initialData={classItem} classId={classItem.id} />
        </div>
    );
}
