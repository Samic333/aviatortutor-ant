
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'student@test.com'
    const user = await prisma.user.findUnique({ where: { email } })
    console.log('User found:', user)

    if (user && user.passwordHash) {
        const valid = await bcrypt.compare('password123', user.passwordHash)
        console.log('Password valid:', valid)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
