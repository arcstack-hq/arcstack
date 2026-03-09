import { H3 } from 'h3'
import { MiddlewareConfig } from 'src/types/config'
import { cors } from '@app/http/middlewares/cors'

const config = (_app: H3): MiddlewareConfig => {
  return {
    global: [cors()],
    before: [],
    after: [],
  }
}

export default config
