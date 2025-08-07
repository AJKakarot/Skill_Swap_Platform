import Meeting from '../models/MeetingRoom.js';


// 1. Create meeting room between two users
export const createMeetingRoom = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.params;

    // Prevent creating a room with yourself
    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "You can't create a meeting with yourself." });
    }

    // Check if meeting room already exists
    let meeting = await Meeting.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (!meeting) {
      meeting = new Meeting({
        participants: [currentUserId, targetUserId],
        sharedFiles: [],
      });

      await meeting.save();
    }

    res.status(200).json({ message: 'Meeting room ready', meeting });
  } catch (error) {
    console.error('Create meeting error:', error.message);
    res.status(500).json({ error: 'Failed to create meeting room' });
  }
};

// 2. Upload PDF to meeting room
export const uploadMeetingPDF = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Ensure uploader is a participant
    if (!meeting.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Unauthorized to upload to this meeting' });
    }

    // Save file path to sharedFiles
    meeting.sharedFiles = meeting.sharedFiles || [];
    meeting.sharedFiles.push(req.file.path);
    await meeting.save();

    res.json({ message: 'PDF uploaded successfully', url: req.file.path });
  } catch (error) {
    console.error('Upload PDF error:', error.message);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};