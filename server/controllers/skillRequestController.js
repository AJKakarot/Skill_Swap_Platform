// controllers/skillRequestController.js
import SkillRequest from "../models/SkillRequest.js";
import User from "../models/User.js";

// Send a skill request
export const sendSkillRequest = async (req, res) => {
  try {
    const { receiverId, senderSkill, receiverSkill } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !senderSkill || !receiverSkill) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent sending request to self
    if (receiverId === senderId.toString()) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check if request already exists
    const existing = await SkillRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      senderSkill,
      receiverSkill,
      status: "pending",
    });
    if (existing) return res.status(400).json({ message: "Request already sent" });

    const request = await SkillRequest.create({
      sender: senderId,
      receiver: receiverId,
      senderSkill,
      receiverSkill,
    });

    // Optional: Emit socket event to receiver
    const io = req.app.get("io"); // socket.io instance
    io.to(receiverId).emit("newSkillRequest", {
      requestId: request._id,
      from: senderId,
      senderSkill,
      receiverSkill,
    });

    res.status(201).json({ message: "Skill request sent successfully", request });
  } catch (err) {
    console.error("Error sending skill request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all requests for current user
export const getSkillRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await SkillRequest.find({ receiver: userId, status: "pending" })
      .populate("sender", "name skills avatar"); // sender info

    res.json(requests);
  } catch (err) {
    console.error("Error fetching skill requests:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept a skill request
export const acceptSkillRequest = async (req, res) => {
  try {
    const { requestId } = req.body; // frontend sends requestId

    const request = await SkillRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";
    await request.save();

    // Optional: Notify sender via socket
    const io = req.app.get("io");
    io.to(request.sender.toString()).emit("requestAccepted", {
      requestId,
      from: req.user._id,
      senderSkill: request.senderSkill,
      receiverSkill: request.receiverSkill,
    });

    res.json({ message: "Skill request accepted", request });
  } catch (err) {
    console.error("Error accepting skill request:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a skill request
export const rejectSkillRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await SkillRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Skill request rejected", request });
  } catch (err) {
    console.error("Error rejecting skill request:", err);
    res.status(500).json({ message: "Server error" });
  }
};
