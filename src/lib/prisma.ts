import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL;

    // Fix for Supabase Transaction Mode (PgBouncer)
    // "prepared statement does not exist" error (Code 26000)
    if (process.env.NODE_ENV === 'production' && url && !url.includes('pgbouncer=true')) {
        url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }

    return new PrismaClient({
        datasources: {
            db: {
                url,
            },
        },
    })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
