// src/utils/socketio.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// Single socket instance for the whole app
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // more stable real-time connection
});

export default socket;