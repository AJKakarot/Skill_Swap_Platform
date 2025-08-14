// backend/socketio.js
import { Server } from "socket.io";

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Change to frontend domain in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Handle joining a room (user-specific)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`📌 User ${userId} joined their room`);
    });

    // Handle video call request
    socket.on("sendCallRequest", ({ from, to }) => {
      io.to(to).emit("receiveCallRequest", { from });
    });

    // Handle call accept — send Google Meet link
    socket.on("acceptCall", ({ from, meetLink }) => {
      io.to(from).emit("callAccepted", { meetLink });
    });

    // Handle PDF sending
    socket.on("sendPDF", ({ to, pdfUrl, title }) => {
      io.to(to).emit("receivePDF", { pdfUrl, title });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

export default { initSocket, getIO };
