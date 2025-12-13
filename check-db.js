
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.user.count();
        console.log("User count:", count);
        if (count > 0) {
            const users = await prisma.user.findMany({ select: { email: true, role: true } });
            console.log("Users:", users);
        }
    } catch (e) {
        console.error("Error connecting:", e);
    } finally {
        await prisma.$disconnect();
    }
}
check();
