import express from "express";
import { getAcceptedUsers, getChat, sendMessage, upload } from "../controllers/chatController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/accepted", isAuthenticated, getAcceptedUsers);
router.get("/:userId", isAuthenticated, getChat);
router.post("/uploaded", isAuthenticated, upload.single("file"), sendMessage);

export default router;
