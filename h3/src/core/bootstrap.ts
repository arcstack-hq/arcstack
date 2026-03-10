import Application from 'src/core/app'
import ErrorHandler from './utils/request-handlers'
import { H3 } from 'h3'

export const h3App = new H3({
  onError: ErrorHandler,
})

export const app = new Application(h3App) 