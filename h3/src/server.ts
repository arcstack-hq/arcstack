import { app } from './core/bootstrap'
import { bootWithDetectedPort } from '@arkstack/common'
import { env } from './core/utils/helpers'

await bootWithDetectedPort(async (port) => {
  await app.boot(parseInt(env('APP_PORT', String(port)), 10))
})
