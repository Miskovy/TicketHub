import { Server, Socket } from "socket.io";
import { verifyToken } from "./utils/auth";

let io: Server;

export const initializeSocket = (socketIO: Server) => {
    io = socketIO;
    io.use((socket: Socket, next) => {
        let token = socket.handshake.auth.token;

        if (!token && socket.handshake.headers.authorization) {
            const parts = socket.handshake.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            const decoded = verifyToken(token);
            socket.data.user = decoded;

            // Check if user has super_admin role
            if (decoded.roles && decoded.roles.includes("super_admin")) {
                socket.join("super_admins");
                console.log(`Socket ${socket.id} joined super_admins room`);
            }

            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
