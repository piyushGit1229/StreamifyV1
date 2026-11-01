import {Server} from "socket.io";
import { registerWatchPartyHandlers } from "../sockets/watchparty.socket.js";

export const initSocket = (server) =>{
    /*
     * ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
     * Socket.IO previously allowed only the first local development origin.
     *
     * const io = new Server(server,{
     *     cors: {
     *         origin: "http://localhost:5173",
     *         credentials: true,
     *     },
     * });
     */

    // NEW IMPLEMENTATION – ENVIRONMENT-BASED CORS
    // Omit an unset CLIENT_URL so local development still works on its own.
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.CLIENT_URL,
    ].filter(Boolean);

    const io = new Server(server,{
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });
    

    io.on("connection",(socket) =>{
        console.log("Socket connected:", socket.id);

        registerWatchPartyHandlers(io,socket);

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
}
