// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String, // For PDF/file sharing
  },
  room: {
    type: String, // Optional chat room ID (UUID or custom)
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;