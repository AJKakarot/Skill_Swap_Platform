import mongoose from 'mongoose';

const meetingRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  sharedFiles: [{ type: String }],
  createdAt: { type: Date, default: Date.now, expires: '1h' },
});

export default mongoose.model('MeetingRoom', meetingRoomSchema);