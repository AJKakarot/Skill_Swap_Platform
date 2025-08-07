// server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';

// Load environment variables
dotenv.config();
connectDB();

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/meeting', meetingRoutes);

// Static folder for PDF uploads
app.use('/uploads', express.static('uploads'));

// Default route
app.get('/', (req, res) => {
  res.send('🎉 Skill Swap API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});