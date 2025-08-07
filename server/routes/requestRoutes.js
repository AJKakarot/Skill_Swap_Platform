import express from 'express';
import {
  createSkillRequest,
  getAllRequests,
  respondToRequest,
  getAcceptedConnections,
} from '../controllers/skillRequestController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Send a skill swap request
router.post('/', verifyToken, createSkillRequest);

// Get all requests sent or received by the logged-in user
router.get('/', verifyToken, getAllRequests);

// Respond to a request (accept/reject)
router.put('/:requestId/respond', verifyToken, respondToRequest);

// ✅ Get all accepted connections
router.get('/accepted', verifyToken, getAcceptedConnections);

export default router;