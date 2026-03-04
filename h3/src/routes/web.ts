import { HTTPResponse } from 'h3'
import { Router } from 'src/core/router'

Router.get('/', () => {
  return new HTTPResponse('Welcome to the H3 application!', {
    headers: {
      'Content-Type': 'text/html',
    },
  })
})
