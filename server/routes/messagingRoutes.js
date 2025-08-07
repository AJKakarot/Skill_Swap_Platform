import express from 'express';
import multer from 'multer';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import {
  accessChat,
  getUserChats,
  createGroupChat,
  sendMessage,
  getChatHistory,
} from '../controllers/messagingController.js';

const router = express.Router();

// File Upload Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/* 🔹 Chat Routes */
router.post('/chat', isAuthenticated, accessChat);
router.get('/chat', isAuthenticated, getUserChats);
router.post('/chat/group', isAuthenticated, createGroupChat);

/* 🔹 Message Routes */
router.post('/message/send', isAuthenticated, upload.single('file'), sendMessage);
router.get('/message/:chatId', isAuthenticated, getChatHistory);

export default router;