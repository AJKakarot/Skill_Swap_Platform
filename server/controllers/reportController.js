import Report from "../models/Report.js";
import sendEmail from "../utils/sendEmail.js";
import OpenAI from "openai";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gajeet031@gmail.com";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Helper Function
async function analyzeReportWithAI(reportText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a moderation assistant. Summarize and score this report." },
        { role: "user", content: reportText }
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "AI analysis failed.";
  }
}

// CREATE Report
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;

    let aiSummary = "AI not enabled.";
    if (process.env.OPENAI_API_KEY) {
      aiSummary = await analyzeReportWithAI(reason);
    }

    const report = await Report.create({
      reporterId: req.user._id,
      reportedUserId,
      reason,
      aiSummary,
    });

    // Notify Admin
    const emailMessage = `
⚠️ New Report Submitted
Reporter: ${req.user.email}
Reported User ID: ${reportedUserId}
Reason: ${reason}

AI Summary: ${aiSummary}
    `;

    await sendEmail(ADMIN_EMAIL, "⚠️ User Report Alert", emailMessage);

    res.status(201).json({ message: "Report submitted & analyzed", report });
  } catch (error) {
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
};

// GET All Reports (Admin only)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reporterId", "email").populate("reportedUserId", "email");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// UPDATE Report with AI re-analysis
export const updateReportAI = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) return res.status(404).json({ message: "Report not found" });

    if (process.env.OPENAI_API_KEY) {
      report.aiSummary = await analyzeReportWithAI(report.reason);
      await report.save();
    }

    res.json({ message: "Report AI summary updated", report });
  } catch (error) {
    res.status(500).json({ message: "Error updating AI summary", error: error.message });
  }
};

// DELETE Report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Report.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
};