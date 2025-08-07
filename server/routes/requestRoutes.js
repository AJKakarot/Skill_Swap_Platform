import express from 'express';
import {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
  getAcceptedConnections,
} from '../controllers/skillRequestController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send/:toUserId', isAuthenticated, sendRequest);
router.get('/my', isAuthenticated, getMyRequests);
router.put('/status/:requestId', isAuthenticated, updateRequestStatus);
router.get('/accepted', isAuthenticated, getAcceptedConnections);

export default router;