import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { createDatabaseClient } from '@arkstack/database'

const prisma = createDatabaseClient({
    connectionString: process.env.DATABASE_URL,
    createAdapter: ({ connectionString }) => new PrismaPg({ connectionString }),
    createClient: ({ adapter }) => new PrismaClient({ adapter }),
})

export { prisma }
