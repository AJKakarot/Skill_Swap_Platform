import express from 'express';
import upload from '../middlewares/upload.js';
import verifyToken from '../middlewares/verifyToken.js';
import {
  registerUser,
  loginUser,
  uploadProfilePhoto,
  getCurrentUser,
} from '../controllers/authController.js'; // includes user controller methods too

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile
router.get('/me', verifyToken, getCurrentUser); // optional
router.put('/upload-photo', verifyToken, upload.single('photo'), uploadProfilePhoto);

export default router;