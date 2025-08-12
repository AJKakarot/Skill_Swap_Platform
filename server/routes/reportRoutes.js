import express from "express";
import {
  createReport,
  getAllReports,
  updateReportAI,
  deleteReport,
} from "../controllers/reportController.js";
import { adminAuth  } from "../middlewares/adminAuth.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User can report
router.post("/", isAuthenticated, createReport);

// Admin routes
router.get("/", isAuthenticated, adminAuth , getAllReports);
router.put("/:id/ai", isAuthenticated, adminAuth , updateReportAI);
router.delete("/:id", isAuthenticated, adminAuth  , deleteReport);

export default router;