import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch accepted users
  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/api/chat/accepted`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch accepted users:", err);
      }
    };
    fetchAcceptedUsers();
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat/send",
        {
          receiverId: selectedUser._id,
          message: newMessage,
        },
        { withCredentials: true }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #000000, #0f0f0f, #1a1a1a, #262626)",
        color: "white",
      }}
    >
      {/* Left Sidebar - Users */}
      <Box
        sx={{
          width: "30%",
          borderRight: "1px solid #333",
          overflowY: "auto",
          background: "linear-gradient(180deg, #000000, #111111, #1a1a1a)",
        }}
      >
        <Typography variant="h6" p={2} sx={{ color: "white" }}>
          Accepted Users
        </Typography>
        <Divider sx={{ bgcolor: "#333" }} />
        <List>
          {users.map((user, index) => (
            <ListItem
              key={`${user._id}-${index}`}
              disablePadding
              sx={{
                backgroundColor:
                  selectedUser?._id === user._id ? "#1e1e1e" : "transparent",
                "&:hover": { backgroundColor: "#2a2a2a" },
              }}
            >
              <ListItemButton onClick={() => setSelectedUser(user)}>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.skills?.join(", ")}
                  primaryTypographyProps={{ sx: { color: "white" } }}
                  secondaryTypographyProps={{ sx: { color: "gray" } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Chat Section */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #333",
                background: "linear-gradient(90deg, #0a0a0a, #111111, #1a1a1a)",
              }}
            >
              <Typography variant="h6" sx={{ color: "white" }}>
                {selectedUser.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                {selectedUser.skills?.join(", ")}
              </Typography>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    alignSelf:
                      msg.sender === selectedUser._id ? "flex-start" : "flex-end",
                    backgroundColor:
                      msg.sender === selectedUser._id ? "#222" : "#444",
                    borderRadius: 2,
                    p: 1.5,
                    maxWidth: "70%",
                    color: "white",
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Input */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 2,
                borderTop: "1px solid #333",
                background: "linear-gradient(90deg, #0a0a0a, #111111, #1a1a1a)",
              }}
            >
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                    "&.Mui-focused fieldset": { borderColor: "#888" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#000",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "gray",
            }}
          >
            <Typography>Select a user to start chatting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
