import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for 1-to-1
    content: { type: String, trim: true },
    file: { type: String }, // file path or URL
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);