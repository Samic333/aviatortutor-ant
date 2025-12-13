import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, role, ...profileData } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Transaction to create user + profile
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    name,
                    role,
                    country: profileData.country,
                    timezone: profileData.timezone,
                },
            });

            if (role === "STUDENT") {
                await tx.studentProfile.create({
                    data: {
                        userId: newUser.id,
                        targetLicense: profileData.targetLicense,
                        authoritiesOfInterest: profileData.authoritiesOfInterest || [],
                    },
                });
            } else if (role === "INSTRUCTOR") {
                await tx.instructorProfile.create({
                    data: {
                        userId: newUser.id,
                        bio: profileData.bio,
                        yearsOfExperience: parseInt(profileData.yearsOfExperience) || 0,
                        authorities: profileData.authorities || [],
                        aircraftTypes: profileData.aircraftTypes || [],
                        company: profileData.company,
                        airlineId: profileData.airlineId, // Add relation
                        languages: profileData.languages || [],
                        pendingApproval: true,
                    },
                });
            }

            return newUser;
        });

        // AUDIT LOG
        await logAuditAction({
            action: "USER_REGISTERED",
            entityType: "User",
            entityId: user.id,
            actor: { id: user.id, role: user.role, email: user.email ?? undefined }, // Self-registered
            status: "SUCCESS",
            metadata: { role: user.role }
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, role: user.role }
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
