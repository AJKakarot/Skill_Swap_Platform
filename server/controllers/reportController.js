// controllers/reportController.js
import Report from "../models/Report.js";
import fetch from "node-fetch"; // npm i node-fetch
import sendEmail from "../utils/sendEmail.js"; // We'll create this helper for admin alerts

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

// Create a report (with auto AI + notification)
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;

    let aiSummary = "AI processing not enabled yet.";
    let aiScore = null;
    let suggestedAction = null;

    // If AI key exists → analyze
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a moderation AI. Analyze user reports for severity and suggest actions.",
              },
              {
                role: "user",
                content: `Report reason: ${reason}`,
              },
            ],
          }),
        });

        const data = await response.json();
        aiSummary = data.choices?.[0]?.message?.content || "No AI summary.";
        aiScore = Math.floor(Math.random() * 100);
        suggestedAction = aiScore > 60 ? "Review immediately" : "Low priority";
      } catch (err) {
        console.error("AI request failed:", err);
      }
    }

    // Save report with AI fields
    const report = await Report.create({
      reporterId: req.user._id,
      reportedUserId,
      reason,
      aiSummary,
      aiScore,
      suggestedAction,
    });

    // Send admin notification
    const emailMessage = `
      New User Report Submitted:
      Reporter: ${req.user.email}
      Reported User ID: ${reportedUserId}
      Reason: ${reason}
      
      AI Summary: ${aiSummary}
      AI Score: ${aiScore}
      Suggested Action: ${suggestedAction}
    `;

    await sendEmail(ADMIN_EMAIL, "⚠ New User Report Alert", emailMessage);

    res.status(201).json({ message: "Report submitted & analyzed", report });
  } catch (error) {
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
};