import { assert, test } from 'vitest'

import { resolveStubsDir } from '../../packages/console/src/app'

test('resolveStubsDir prefers localStubsDir from config', () => {
    const selected = resolveStubsDir({
        localStubsDir: 'src/app/console/stubs',
    })

    assert.equal(selected, `${process.cwd()}/src/app/console/stubs`)
})

test('resolveStubsDir falls back to options stubsDir', () => {
    const selected = resolveStubsDir(undefined, {
        stubsDir: '/tmp/stubs',
    })

    assert.equal(selected, '/tmp/stubs')
})

test('resolveStubsDir returns undefined without config or fallback', () => {
    const selected = resolveStubsDir(undefined)

    assert.equal(selected, undefined)
})
