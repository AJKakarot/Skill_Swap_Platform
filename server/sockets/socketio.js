import { Server } from "socket.io";

let io;

export default {
  initSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // exact frontend URL
        methods: ["GET", "POST"],
        credentials: true, // MUST allow credentials
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("sendMessage", ({ sender, receiver, message, fileUrl, type }) => {
        io.to(receiver).emit("newMessage", {
          sender,
          message,
          fileUrl,
          type,
          createdAt: new Date(),
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  },
  getIO: () => io,
};
