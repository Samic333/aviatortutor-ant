
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const AIRLINES = [
    { name: "Delta Air Lines", iata: "DL", icao: "DAL", country: "USA" },
    { name: "United Airlines", iata: "UA", icao: "UAL", country: "USA" },
    { name: "American Airlines", iata: "AA", icao: "AAL", country: "USA" },
    { name: "Lufthansa", iata: "LH", icao: "DLH", country: "Germany" },
    { name: "British Airways", iata: "BA", icao: "BAW", country: "UK" },
    { name: "Air France", iata: "AF", icao: "AFR", country: "France" },
    { name: "Emirates", iata: "EK", icao: "UAE", country: "UAE" },
    { name: "Qatar Airways", iata: "QR", icao: "QTR", country: "Qatar" },
    { name: "Singapore Airlines", iata: "SQ", icao: "SIA", country: "Singapore" },
    { name: "Cathay Pacific", iata: "CX", icao: "CPA", country: "Hong Kong" },
    { name: "ANA All Nippon Airways", iata: "NH", icao: "ANA", country: "Japan" },
    { name: "Japan Airlines", iata: "JL", icao: "JAL", country: "Japan" },
    { name: "Qantas", iata: "QF", icao: "QFA", country: "Australia" },
    { name: "Air Canada", iata: "AC", icao: "ACA", country: "Canada" },
    { name: "Turkish Airlines", iata: "TK", icao: "THY", country: "Turkey" },
    { name: "Etihad Airways", iata: "EY", icao: "ETD", country: "UAE" },
    { name: "Korean Air", iata: "KE", icao: "KAL", country: "South Korea" },
    { name: "Swiss International Air Lines", iata: "LX", icao: "SWR", country: "Switzerland" },
    { name: "Virgin Atlantic", iata: "VS", icao: "VIR", country: "UK" },
    { name: "KLM Royal Dutch Airlines", iata: "KL", icao: "KLM", country: "Netherlands" },
    { name: "SAS Scandinavian Airlines", iata: "SK", icao: "SAS", country: "Sweden" },
    { name: "Finnair", iata: "AY", icao: "FIN", country: "Finland" },
    { name: "Aer Lingus", iata: "EI", icao: "EIN", country: "Ireland" },
    { name: "Iberia", iata: "IB", icao: "IBE", country: "Spain" },
    { name: "TAP Air Portugal", iata: "TP", icao: "TAP", country: "Portugal" },
    { name: "Ryanair", iata: "FR", icao: "RYR", country: "Ireland" },
    { name: "EasyJet", iata: "U2", icao: "EZY", country: "UK" },
    { name: "Wizz Air", iata: "W6", icao: "WZZ", country: "Hungary" },
    { name: "Southwest Airlines", iata: "WN", icao: "SWA", country: "USA" },
    { name: "JetBlue Airways", iata: "B6", icao: "JBU", country: "USA" }
];

async function main() {
    console.log("Starting seed...");
    const password = await bcrypt.hash('password123', 10)

    // 0. Seed Airlines
    console.log(`Seeding ${AIRLINES.length} airlines...`);
    for (const airline of AIRLINES) {
        await prisma.airline.upsert({
            where: { name: airline.name },
            update: {},
            create: {
                name: airline.name,
                iataCode: airline.iata,
                icaoCode: airline.icao,
                country: airline.country
            }
        });
    }

    const dl = await prisma.airline.findUnique({ where: { name: "Delta Air Lines" } });
    const lh = await prisma.airline.findUnique({ where: { name: "Lufthansa" } });

    // 1. Core Users
    const users = [
        { email: 'owner.001@example.com', name: 'OWNER-001', role: 'OWNER' },
        { email: 'sadm.001@example.com', name: 'SADM-001', role: 'SUPER_ADMIN' },
        { email: 'adm.001@example.com', name: 'ADM-001', role: 'ADMIN' },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { email: u.email, name: u.name, role: u.role as any, passwordHash: password }
        });
    }

    // 2. Instructor - Approved (INST-001)
    const inst1 = await prisma.user.upsert({
        where: { email: 'inst.001@example.com' },
        update: {},
        create: {
            email: 'inst.001@example.com', name: 'INST-001 (Capt. Smith)', passwordHash: password, role: 'INSTRUCTOR',
            instructorProfile: {
                create: {
                    pendingApproval: false,
                    bio: "Senior Captain with 20 years experience.",
                    yearsOfExperience: 20,
                    hourlyRateDefault: 150,
                    authorities: ["FAA", "EASA"],
                    airlineId: dl?.id
                }
            }
        },
        include: { instructorProfile: true }
    });

    // 3. Instructor - Pending (INST-002)
    const inst2 = await prisma.user.upsert({
        where: { email: 'inst.002@example.com' },
        update: {},
        create: {
            email: 'inst.002@example.com', name: 'INST-002 (FO Jones)', passwordHash: password, role: 'INSTRUCTOR',
            instructorProfile: {
                create: {
                    pendingApproval: true,
                    bio: "First Officer looking to teach.",
                    yearsOfExperience: 5,
                    hourlyRateDefault: 80,
                    authorities: ["EASA"],
                    airlineId: lh?.id
                }
            }
        }
    });

    // 4. Students
    const stud1 = await prisma.user.upsert({
        where: { email: 'stud.001@example.com' },
        update: {}, // Don't wipe relations on update
        create: {
            email: 'stud.001@example.com', name: 'STUD-001 (Alice)', passwordHash: password, role: 'STUDENT',
            studentProfile: { create: { targetLicense: "PPL" } }
        }
    });

    const stud2 = await prisma.user.upsert({
        where: { email: 'stud.002@example.com' },
        update: {},
        create: {
            email: 'stud.002@example.com', name: 'STUD-002 (Bob)', passwordHash: password, role: 'STUDENT',
            studentProfile: { create: { targetLicense: "ATPL" } }
        }
    });

    // 5. Classes
    if (inst1.instructorProfile) {
        const cls = await prisma.class.upsert({
            where: { id: 'class-001' }, // Hardcoded ID for idempotency if wanted, or findUnique by title if schema allows. But ID is uuid.
            // Actually, let's use findFirst logic or just create if not exists
            update: { authorityStandard: "FAA" },
            create: {
                id: 'class-001',
                instructorId: inst1.instructorProfile.id,
                title: "CLASS-001: A320 Type Rating Prep",
                shortDescription: "Master the A320 systems",
                detailedDescription: "A comprehensive guide to the A320.",
                type: "ONE_ON_ONE",
                pricePerHour: 150,
                status: "PUBLISHED",
                authority: "FAA",
                authorityStandard: "FAA"
            }
        });

        // 6. Conversations & Messages
        // Conversation between STUD-001 and INST-001

        // Check if conversation exists
        let conv = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: stud1.id } } },
                    { participants: { some: { id: inst1.id } } }
                ]
            }
        });

        if (!conv) {
            conv = await prisma.conversation.create({
                data: {
                    createdById: stud1.id, // STUDENT started it
                    participants: { connect: [{ id: stud1.id }, { id: inst1.id }] }
                }
            });

            await prisma.message.create({
                data: {
                    conversationId: conv.id,
                    senderId: stud1.id,
                    content: "Hi Captain Smith, I am interested in your A320 course."
                }
            });
            await prisma.message.create({
                data: {
                    conversationId: conv.id,
                    senderId: inst1.id,
                    content: "Hello Alice! Happy to help. What is your current level?"
                }
            });
        }
    }

    console.log("Seeding complete.");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
