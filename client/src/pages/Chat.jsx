import React, { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Avatar, TextField,
  IconButton, Paper, Divider, List, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { io } from "socket.io-client";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";
const socket = io(API_BASE.replace("/api",""), { withCredentials: true });

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef();
  const messagesEndRef = useRef();

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch users with accepted requests
  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/chat/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch accepted users:", err.message);
      }
    };
    fetchAcceptedUsers();
  }, []);

  // Join Socket.IO room for selected user
  useEffect(() => {
    if (!selectedUser) return;
    socket.emit("joinRoom", selectedUser._id);

    const handleIncomingMessage = (msg) => {
      if (msg.sender === selectedUser._id || msg.receiverId === selectedUser._id)
        setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleIncomingMessage);
    return () => socket.off("receiveMessage", handleIncomingMessage);
  }, [selectedUser]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      receiverId: selectedUser._id,
      content: newMessage.trim(),
      type: "text",
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, { ...msgData, senderSelf: true }]);
    setNewMessage("");
  };

  const sendPDF = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/chat/upload/${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      socket.emit("sendMessage", {
        receiverId: selectedUser._id,
        content: res.data.fileUrl,
        type: "pdf",
      });

      setMessages((prev) => [...prev, { content: res.data.fileUrl, type: "pdf", senderSelf: true }]);
    } catch (err) {
      console.error("Failed to send PDF:", err.message);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "80vh", boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
      {!selectedUser && (
        <Paper sx={{ width: "30%", overflowY: "auto", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Chats</Typography>
          <List>
            {users.map((user) => (
              <ListItem button key={user._id} onClick={() => setSelectedUser(user)}>
                <ListItemAvatar><Avatar src={user.avatar} /></ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.skills?.join(", ")} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {selectedUser && (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: "#1976d2", color: "white" }}>
            <IconButton onClick={() => setSelectedUser(null)} sx={{ color: "white", mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Avatar src={selectedUser.avatar} sx={{ mr: 2 }} />
            <Typography variant="h6">{selectedUser.name}</Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 2, backgroundColor: "#f4f6f8" }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ display: "flex", justifyContent: msg.senderSelf ? "flex-end" : "flex-start", mb: 1 }}>
                <Paper sx={{ p: 1.5, backgroundColor: msg.senderSelf ? "#1976d2" : "#fff", color: msg.senderSelf ? "white" : "black", maxWidth: "70%" }}>
                  {msg.type === "pdf" ? (
                    <a href={msg.content} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>📄 PDF File</a>
                  ) : msg.content}
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />
          <Box sx={{ display: "flex", p: 1 }}>
            <IconButton onClick={() => fileInputRef.current.click()}><AttachFileIcon /></IconButton>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={sendPDF} accept="application/pdf" />
            <TextField fullWidth size="small" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
            <IconButton onClick={sendMessage}><SendIcon /></IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
