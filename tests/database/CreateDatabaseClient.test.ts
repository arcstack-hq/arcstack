import { describe, expect, it } from 'vitest'

import { createDatabaseClient } from '../../packages/database/src'

describe('createDatabaseClient', () => {
    it('uses explicit connection string when provided', () => {
        const client = createDatabaseClient({
            connectionString: 'postgres://explicit',
            createAdapter: ({ connectionString }) => ({ connectionString }),
            createClient: ({ adapter }) => ({ adapter }),
        })

        expect(client).toEqual({
            adapter: {
                connectionString: 'postgres://explicit',
            },
        })
    })

    it('falls back to DATABASE_URL from environment', () => {
        const previous = process.env.DATABASE_URL
        process.env.DATABASE_URL = 'postgres://env'

        const client = createDatabaseClient({
            createAdapter: ({ connectionString }) => ({ connectionString }),
            createClient: ({ adapter }) => ({ adapter }),
        })

        expect(client).toEqual({
            adapter: {
                connectionString: 'postgres://env',
            },
        })

        process.env.DATABASE_URL = previous
    })
})
