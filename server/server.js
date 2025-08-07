import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // your MongoDB config
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import messagingRoutes from './routes/messagingRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/messages', messagingRoutes); // 💬 Combined messaging module

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Skill Swap API is running...');
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});