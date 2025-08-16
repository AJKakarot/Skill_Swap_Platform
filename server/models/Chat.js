import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  chatName: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);