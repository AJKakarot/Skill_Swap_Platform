import SkillRequest from '../models/SkillRequest.js';
import User from '../models/User.js';

// 1. Create a skill swap request
export const createSkillRequest = async (req, res) => {
  try {
    const { receiverId, senderSkill, receiverSkill } = req.body;

    // Prevent sending request to self
    if (req.userId === receiverId) {
      return res.status(400).json({ error: "You can't send a request to yourself." });
    }

    // Check if request already exists
    const existingRequest = await SkillRequest.findOne({
      sender: req.userId,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent and pending.' });
    }

    const newRequest = new SkillRequest({
      sender: req.userId,
      receiver: receiverId,
      senderSkill,
      receiverSkill,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Request sent successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating skill request:', error.message);
    res.status(500).json({ error: 'Failed to create skill request' });
  }
};

// 2. Get all requests sent or received by current user
export const getAllRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await SkillRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name email skills photo')
      .populate('receiver', 'name email skills photo')
      .sort({ updatedAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error.message);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// 3. Respond to a request (accept or reject)
export const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be accepted or rejected.' });
    }

    const request = await SkillRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Only receiver can respond
    if (request.receiver.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error('Error responding to request:', error.message);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
};

// 4. Get accepted connections for current user
export const getAcceptedConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const acceptedConnections = await SkillRequest.find({
      status: 'accepted',
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name email skills photo')
      .populate('receiver', 'name email skills photo')
      .sort({ updatedAt: -1 });

    res.json({ connections: acceptedConnections });
  } catch (error) {
    console.error('Error fetching accepted connections:', error.message);
    res.status(500).json({ error: 'Failed to fetch accepted connections' });
  }
};