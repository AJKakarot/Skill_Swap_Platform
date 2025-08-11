import express from "express";
import {
  createReport,
  getAllReports,
  updateReportAI,
  deleteReport,
} from "../controllers/reportController.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User can report
router.post("/", protect, createReport);

// Admin routes
router.get("/", protect, adminOnly, getAllReports);
router.put("/:id/ai", protect, adminOnly, updateReportAI);
router.delete("/:id", protect, adminOnly, deleteReport);

export default router;