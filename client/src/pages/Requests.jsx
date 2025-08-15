import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/skill-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/skill-requests/accept",
        { requestId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "accepted" } : r))
      );
  
      // Redirect to chatroom
      window.location.href = "/chat";
    } catch (err) {
      console.error("Error accepting request:", err.response?.data || err.message);
    }
  };
  
  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/skill-requests/reject",
        { requestId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      console.error("Error rejecting request:", err.response?.data || err.message);
    }
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Received Skill Requests
      </Typography>

      {requests.map((req) => (
        <Box
          key={req._id}
          sx={{
            mb: 2,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {req.sender.name} wants {req.receiverSkill} in exchange for{" "}
            {req.senderSkill} ({req.status})
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {req.status === "pending" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => acceptRequest(req)}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => rejectRequest(req._id)}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default Requests;
