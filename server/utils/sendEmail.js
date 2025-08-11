// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: "Skill Swap Admin"` <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📩 Email sent to admin");
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
};

export default sendEmail;