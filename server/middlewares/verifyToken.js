// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔐 Validate Authorization Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 🔑 Verify and Decode Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🛡 Ensure token payload contains `id`
    const userId = decoded?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload: Missing user ID' });
    }

    // 👤 Fetch user from DB
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Attach to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    return res.status(500).json({ error: 'Server error during token verification' });
  }
};

export default verifyToken;
