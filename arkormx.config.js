import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { defineConfig } from 'arkormx'

export default defineConfig({
    paths: {
        models: './src/models',
        factories: './database/factories',
        seeders: './database/seeders',
        migrations: './database/migrations',
        buildOutput: './dist',
    },
    outputExt: 'ts',
    prisma: () => {
        return new PrismaClient({
            adapter: new PrismaPg({
                connectionString: process.env.DATABASE_URL,
            }),
        })
    },
})