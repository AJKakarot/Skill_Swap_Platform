// controllers/adminController.js
import User from "../models/User.js";
import Report from "../models/Report.js";
import sendEmail from "../utils/sendEmail.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// SEARCH user by email
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error searching user", error: error.message });
  }
};

// DELETE user by ID
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// GET all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporterId", "name email")
      .populate("reportedUserId", "name email");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// TAKE action on report
export const resolveReport = async (req, res) => {
  try {
    const { reportId, action } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = action;
    await report.save();

    await sendEmail(
      req.user.email,
      "Report Resolved",
      `Report ${reportId} has been marked as ${action}`
    );

    res.json({ message: "Report status updated", report });
  } catch (error) {
    res.status(500).json({ message: "Error resolving report", error: error.message });
  }
};