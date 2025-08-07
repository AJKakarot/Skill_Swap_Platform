
import express from 'express';
import {
  register,
  login,
  logout,
  getMyProfile,
  getAllUsersBySkill,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/my-profile', isAuthenticated, getMyProfile);
router.get('/users/:skill', isAuthenticated, getAllUsersBySkill); // For filtering users by skill

export default router;