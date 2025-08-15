import express from 'express';
import upload from '../middlewares/upload.js';
import verifyToken from '../middlewares/verifyToken.js';
import {
  registerUser,
  loginUser,
  uploadProfilePhoto,
  getCurrentUser,
  getAllUsers,
  logoutUser
} from '../controllers/authController.js'; // includes user controller methods too
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users',isAuthenticated, getAllUsers); // Get all users except the currently logged-in user
router.post('/logout', isAuthenticated, logoutUser); // Logout user

// Profile
router.get('/me', isAuthenticated, getCurrentUser); // optional
router.put('/upload-photo', isAuthenticated, upload.single('photo'), uploadProfilePhoto);

export default router;