import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const passwordHash = await bcrypt.hash("123", 10);

    // STUDENT
    await prisma.user.upsert({
        where: { email: "student@test.com" },
        update: { passwordHash },
        create: {
            email: "student@test.com",
            name: "Test Student",
            passwordHash,
            role: "STUDENT",
            country: "USA",
            timezone: "America/New_York",
            studentProfile: {
                create: {
                    targetLicense: "PPL",
                    authoritiesOfInterest: ["FAA"],
                }
            }
        }
    });

    // INSTRUCTOR
    const instructor = await prisma.user.upsert({
        where: { email: "instructor@test.com" },
        update: { passwordHash },
        create: {
            email: "instructor@test.com",
            name: "Test Instructor",
            passwordHash,
            role: "INSTRUCTOR",
            country: "UK",
            timezone: "Europe/London",
            instructorProfile: {
                create: {
                    bio: "Experienced instructor.",
                    yearsOfExperience: 5,
                    authorities: ["UK CAA"],
                    introVideoUrl: "https://example.com/video",
                    pendingApproval: false, // Auto-approve test instructor
                }
            }
        }
    });

    // ADMIN
    await prisma.user.upsert({
        where: { email: "admin@test.com" },
        update: { passwordHash },
        create: {
            email: "admin@test.com",
            name: "Test Admin",
            passwordHash,
            role: "ADMIN",
        }
    });

    // SUPER_ADMIN
    await prisma.user.upsert({
        where: { email: "superadmin@test.com" },
        update: { passwordHash },
        create: {
            email: "superadmin@test.com",
            name: "Test SuperAdmin",
            passwordHash,
            role: "SUPER_ADMIN",
        }
    });

    // OWNER
    await prisma.user.upsert({
        where: { email: "owner@test.com" },
        update: { passwordHash },
        create: {
            email: "owner@test.com",
            name: "Test Owner",
            passwordHash,
            role: "OWNER",
        }
    });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
