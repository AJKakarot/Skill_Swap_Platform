
// middleware/adminAuth.js
export const adminAuth = (req, res, next) => {
    if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };