import 'reflect-metadata'

import fastify from 'fastify'
import { bootstrap } from 'fastify-decorators'

const instance = fastify()

instance.register(bootstrap, {
    directory: __dirname,
    mask: /\.controller\./gi,
})

export { instance }