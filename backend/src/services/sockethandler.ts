import {Socket, Server} from "socket.io"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types/types"

type IOServer = Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>
type IOSocket = Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>

export class SocketHandler {
    constructor(private io : IOServer) {}

    register(socket : IOSocket){
        console.log(`Socket ID is ${socket.id}`)
    }


    joinRoom(){
        
    }

}