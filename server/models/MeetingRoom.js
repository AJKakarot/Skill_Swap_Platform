// models/MeetingRoom.js
import mongoose from 'mongoose';

const meetingRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h', // Auto-delete after 1 hour (optional)
  },
});

const MeetingRoom = mongoose.model('MeetingRoom', meetingRoomSchema);
export default MeetingRoom;