// Native
import { Server } from 'http'

// Pkgs
import { Server as SocketServer } from 'socket.io'

// Ours
import { Logger } from './logger/index'

// Types
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket-args'
import { SocketEventTypes } from '../types/socket-enums'

const log = new Logger('FCG-Controller/server/socket')

export let io: SocketServer<ClientToServerEvents, ServerToClientEvents>

export function init (server: Server) {
    io = new SocketServer(server, {
        serveClient: false,
    })

    // Socket.IO setup
    io.on('connection', (socket) => {
        log.trace('New socket connection: ID %s with IP %s', socket.id, socket.handshake.address)

        socket.on('error', err => {
            log.error(err.stack)
        })

        socket.on(SocketEventTypes.JoinRoom, room => {
            socket.join(room)
        })
    })
}
