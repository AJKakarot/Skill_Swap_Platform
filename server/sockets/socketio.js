import { Server } from "socket.io";

let io;

export default {
  initSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // ✅ Match frontend "joinRoom"
      socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`📌 User ${userId} joined their personal room`);
      });

      // ✅ Match frontend "sendMessage"
      socket.on("sendMessage", ({ receiverId, content, type }) => {
        console.log(`📤 Message to ${receiverId}:`, content);

        // Emit to receiver
        io.to(receiverId).emit("receiveMessage", {
          sender: socket.id, // or better: attach actual userId if using auth
          receiverId,
          content,
          type,
          createdAt: new Date(),
        });
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });
  },

  getIO: () => io,
};
