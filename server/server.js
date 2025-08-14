import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // your MongoDB config
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import messagingRoutes from './routes/messagingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // Fixed spelling
import socketService from './sockets/socketio.js'; // Import socket service
import http from 'http';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  
}));
app.use(express.json());



// Static folder for uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/messages', messagingRoutes); // 💬 Combined messaging module
app.use('/api/admin', adminRoutes); // Admin routes for managing reports and users
app.use('/api/reports', reportRoutes); // Report routes for user reports

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io with the server
socketService.initSocket(server);

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
