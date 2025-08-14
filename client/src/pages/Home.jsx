import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import socket from "../utils/socketio"; // socket connection

// Page background
const GradientBackground = styled(Box)({
  flex: 1,
  width: "100%",
  minHeight: "calc(100vh - 64px - 80px)",
  background: "linear-gradient(135deg, #000000, #0f2027, #203a43, #2c5364)",
  color: "#fff",
  paddingBottom: "50px",
  display: "flex",
  flexDirection: "column",
});

// Single user row styling
const UserRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 10px",
  borderRadius: "8px",
  marginBottom: "12px",
  background: "linear-gradient(135deg, #000000, #0f2027, #203a43, #2c5364)",
  color: "#fff",
  width: "100%",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",

  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 20px rgba(0, 198, 255, 0.4)",
    cursor: "pointer",
  },
});
export default function Home() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentUserId(res.data._id);

        return axios.get("http://localhost:4000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });

    socket.emit("joinRoom", currentUserId);

    socket.on("receiveCallRequest", ({ from }) => setIncomingRequest(from));
    socket.on("callAccepted", ({ meetLink }) => window.open(meetLink, "_blank"));

    return () => {
      socket.off("receiveCallRequest");
      socket.off("callAccepted");
    };
  }, [currentUserId]);

  const sendCallRequest = (toId) => {
    socket.emit("sendCallRequest", { from: currentUserId, to: toId });
  };

  const acceptCall = () => {
    const meetLink = "https://meet.google.com/demo-link";
    socket.emit("acceptCall", { from: incomingRequest, meetLink });
    setIncomingRequest(null);
  };

  return (
    <GradientBackground>
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Swap Skills, Grow Together
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: "600px", mx: "auto", color: "#ccc", mb: 4 }}
        >
          Connect with people who have the skills you want to learn, and share
          your own expertise in return.
        </Typography>
      </Container>

      <Container>
        {users.map((user) => (
          <UserRow key={user._id}>
            {/* Left side: User info */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2">
                Skills: {user.skills.join(", ")}
              </Typography>
            </Box>

            {/* Right side: Actions */}
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ff4b2b",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  px: 2,
                  "&:hover": { backgroundColor: "#e84118" },
                }}
              >
                Report
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00b894",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  px: 2,
                  "&:hover": { backgroundColor: "#009970" },
                }}
                onClick={() => sendCallRequest(user._id)}
              >
                Send Request
              </Button>
              {incomingRequest === user._id && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#6c5ce7",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    px: 2,
                    "&:hover": { backgroundColor: "#5a4dd6" },
                  }}
                  onClick={acceptCall}
                >
                  Accept Video Call
                </Button>
              )}
            </Box>
          </UserRow>
        ))}
      </Container>

      {/* Video call request dialog */}
      <Dialog open={!!incomingRequest}>
        <DialogTitle>{incomingRequest} is requesting a video call</DialogTitle>
        <DialogActions>
          <Button onClick={() => setIncomingRequest(null)}>Reject</Button>
          <Button onClick={acceptCall} variant="contained">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </GradientBackground>
  );
}
