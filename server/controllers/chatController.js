import ChatMessage from "../models/Chat.js";
import multer from "multer";
import path from "path";


// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/chats"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or image files allowed"));
    }
  }
});

// Get all accepted users for current user
export const getAcceptedUsers = async (req, res) => {
  try {
    const userId = req.user.id; // depends on authMiddleware
    const users = await ChatMessage.find({
      requester: userId,
      status: "accepted",
    }).populate("receiver", "name email");
    res.json(users);
  } catch (err) {
    console.error("Error fetching accepted users:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Get chat history between two users
export const getChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const fileUrl = req.file ? `/uploads/chats/${req.file.filename}` : null;

    const newMessage = await ChatMessage.create({
      sender: req.user.id,
      receiver,
      message,
      fileUrl
    });

    // Emit via socket.io
    req.io.to(receiver).emit("newMessage", newMessage);
    req.io.to(req.user.id).emit("newMessage", newMessage);

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
