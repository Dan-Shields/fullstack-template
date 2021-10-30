
import { SocketEventTypes } from "./socket-enums"

interface ServerToClientEvents {
    [SocketEventTypes.TestEvent]: (arg1: string, arg2: number) => void;
}
interface ClientToServerEvents {
    [SocketEventTypes.JoinRoom]: (roomName: string) => void;
    [SocketEventTypes.TestEvent]: (arg1: string, arg2: number) => void;
}
