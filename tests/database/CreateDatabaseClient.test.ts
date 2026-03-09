import { describe, expect, it } from 'vitest'

import { Model } from 'arkormx'
import { beforeEach } from 'node:test'

let inc: number = new Date().getTime()

class User extends Model {
    declare id: number
    declare firstName: string
    declare lastName: string
    declare email: string
}

describe('Modeling Dats', () => {
    beforeEach(async () => {
        inc = new Date().getTime()
    })

    it('Can create a new model', async () => {
        const user = await User.query().create({
            email: `john.doe${inc}@example.com`,
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        })

        expect(user).toBeDefined()
        expect(user.id).toBeDefined()
        expect(user.email).toBe(`john.doe${inc}@example.com`)
        expect(user.firstName).toBe('John')
        expect(user.lastName).toBe('Doe')
    })

    it('can get a model', async () => {
        const user = await User.query().where({ email: `john.doe${inc}@example.com` }).first()

        expect(user).toBeDefined()
        expect(user?.id).toBeDefined()
        expect(user?.email).toBe(`john.doe${inc}@example.com`)
        expect(user?.firstName).toBe('John')
        expect(user?.lastName).toBe('Doe')
    })

    it('can update a model', async () => {
        const user = await User.query().where({ email: `john.doe${inc}@example.com` }).first()

        expect(user).toBeDefined()

        if (user) {
            user.firstName = 'Jane'
            user.lastName = 'Doe'
            await user.save()

            const updatedUser = await User.query().where({ email: `john.doe${inc}@example.com` }).first()

            expect(updatedUser).toBeDefined()
            expect(updatedUser?.firstName).toBe('Jane')
            expect(updatedUser?.lastName).toBe('Doe')
        }
    })

    it('can delete a model', async () => {
        const user = await User.query().where({ email: `john.doe${inc}@example.com` }).first()

        expect(user).toBeDefined()

        if (user) {
            await user.delete()

            const deletedUser = await User.query().where({ email: `john.doe${inc}@example.com` }).first()

            expect(deletedUser).toBeNull()
        }
    })
})
