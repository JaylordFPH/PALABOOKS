import {PrismaClient} from "@prisma/client"

const globalThisPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
};

export const prisma = globalThisPrisma.prisma ?? new PrismaClient({log: ['query', "warn", "error"]})

if (process.env.NODE_ENV !== 'production') globalThisPrisma.prisma = prisma
