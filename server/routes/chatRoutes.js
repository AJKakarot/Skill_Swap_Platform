import express from 'express';
import multer from 'multer';
import {
  sendMessage,
  getChatHistory,
} from '../controllers/messageController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/send', isAuthenticated, upload.single('file'), sendMessage);
router.get('/with/:userId', isAuthenticated, getChatHistory);

export default router;