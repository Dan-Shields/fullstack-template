import { config } from './config'

// Native
import { EventEmitter } from 'events'
import { createServer as createHTTPServer, Server } from 'http'

// Packages
import express from 'express'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import compression from 'compression'
import mongoose from 'mongoose'

// Ours
import webRoutes from './routes/web'
import apiRoutes from './routes/api'
import { Logger } from './logger/index'
import { init as initSocket } from './socket'

const log = new Logger(`${process.title}/server`)

let app: express.Application
let server: Server
let vite: ViteDevServer

export const emitter = new EventEmitter()

export async function start () {

    // DB
    mongoose.connect(`mongodb://localhost:27017/${process.title}`)
    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error: '))
    db.once('open', async () => {
        // create Express app, HTTP(S) & Socket.IO servers
        app = express()
        server = createHTTPServer(app)

        initSocket(server)

        // Set up vite
        vite = await createViteServer({
            root: process.env.ROOT,
            server: {
                middlewareMode: true
            },
            mode: process.env.NODE_ENV || 'production'
        })

        // Set up Express
        log.debug('Setting up Express')
        app.use(vite.middlewares)
        app.use(compression())
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        // Cross-origin isolation
        app.use((req, res, next) => {
            res.set({
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin'
            })

            next()
        })

        
        log.debug('Loading routes')
        app.use(webRoutes())
        app.use('/api', apiRoutes())

        server.on('error', (err: NodeJS.ErrnoException) => {
            switch (err.code) {
                case 'EADDRINUSE':
                    log.error(`Listen ${config.host}:${config.port} in use, is ${process.title} already running? ${process.title} will now exit.`)
                    break
                default:
                    log.error('Unhandled error!', err)
                    break
            }
            
            emitter.emit('error', err)
        })
        
        log.debug(`Attempting to listen on ${config.host}:${config.port}`)
        server.listen({
            host: config.host,
            port: config.port
        }, () => {
            const protocol = 'http'
            log.info(`${process.title} running on ${protocol}://${config.host}:${config.port}`)
            emitter.emit('started')
        })
    })
}

export default { emitter, start }
