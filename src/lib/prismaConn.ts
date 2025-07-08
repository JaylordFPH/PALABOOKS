import {PrismaClient} from "@prisma/client"

const globalThisPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
};

export const prisma = globalThisPrisma.prisma ?? new PrismaClient({    
    log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'stdout' },  
        { level: 'warn', emit: 'stdout' },
    ],
})

if (process.env.NODE_ENV !== 'production') globalThisPrisma.prisma = prisma
