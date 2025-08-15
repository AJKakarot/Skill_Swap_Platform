import express from "express";
import {
  sendSkillRequest,
  getSkillRequests,
  acceptSkillRequest,
  rejectSkillRequest,
} from "../controllers/skillRequestController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendSkillRequest);
router.get("/", isAuthenticated, getSkillRequests);
router.post("/accept", isAuthenticated, acceptSkillRequest);
router.post("/reject", isAuthenticated, rejectSkillRequest);

export default router;
