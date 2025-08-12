// routes/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  searchUserByEmail,
  deleteUser,
  getAllReports,
  resolveReport,
} from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.use(isAuthenticated, adminAuth); // all admin routes need admin check

router.get("/users", getAllUsers);
router.get("/users/search", searchUserByEmail);
router.delete("/users/:id", deleteUser);

router.get("/reports", getAllReports);
router.post("/reports/resolve", resolveReport);

export default router;