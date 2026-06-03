const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.allowedOrigins,
      credentials: true,
    },
  });

  // Handshake authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const payload = jwt.verify(token, env.jwt.accessSecret);
      socket.user = {
        id: payload.sub,
        role: payload.role,
      };
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    const roomName = `user:${userId}`;

    // Join user-specific room
    socket.join(roomName);
    console.log(`Socket client connected: ${socket.id}, joined room: ${roomName}`);

    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

// Global helper to send messages to a specific user room
const emitToUser = (userId, eventName, payload) => {
  if (io) {
    io.to(`user:${userId}`).emit(eventName, payload);
  }
};

module.exports = {
  initSocket,
  getIo,
  emitToUser,
};
