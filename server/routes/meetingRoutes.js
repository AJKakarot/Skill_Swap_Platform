import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createMeetingRoom } from '../controllers/meetingController.js';

const router = express.Router();

router.post('/room/:targetUserId', isAuthenticated, createMeetingRoom);

export default router;