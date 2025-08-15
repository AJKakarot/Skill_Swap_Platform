import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  fileUrl: { type: String }, // For PDF or other attachments
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
