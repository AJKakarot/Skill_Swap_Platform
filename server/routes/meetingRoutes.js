import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { createMeetingRoom } from '../controllers/meetingController.js';
import verifyToken from '../middlewares/verifyToken.js';
import multer from 'multer';
import upload from '../middlewares/upload.js';
import * as meetingController from '../controllers/meetingController.js';

const router = express.Router();

router.post('/room/:targetUserId', isAuthenticated, createMeetingRoom);
// POST /api/meetings/:meetingId/upload-pdf
router.post(
    '/:meetingId/upload-pdf',
    verifyToken,
    upload.single('pdf'),
    meetingController.uploadMeetingPDF
  );

export default router;