import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    fileUrl: { type: String }, 
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }// for PDFs/images
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
