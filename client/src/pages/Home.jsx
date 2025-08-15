import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  Container,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [senderSkill, setSenderSkill] = useState(""); // your skill
  const [receiverSkill, setReceiverSkill] = useState({}); // each user's selected skill

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Get current user
    axios
      .get("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error(err));

    // Get all users
    axios
      .get("http://localhost:4000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.filter((u) => u._id !== currentUser?._id)))
      .catch((err) => console.error(err));
  }, [currentUser?._id]);

  const sendSkillRequest = async (receiverId) => {
    if (!currentUser) return;

    const selectedReceiverSkill = receiverSkill[receiverId];
    if (!senderSkill || !selectedReceiverSkill) {
      alert("Please select both your skill and receiver's skill!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/skill-requests/send",
        {
          receiverId,
          senderSkill,
          receiverSkill: selectedReceiverSkill,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPopupOpen(true);
    } catch (err) {
      console.error("Error sending request:", err.response?.data || err.message);
    }
  };

  return (
    <GradientBackground>
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Swap Skills, Grow Together
        </Typography>

        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel>My Skill</InputLabel>
          <Select
            value={senderSkill}
            onChange={(e) => setSenderSkill(e.target.value)}
            label="My Skill"
          >
            {currentUser?.skills?.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>

      <Container>
        {users.map((user) => (
          <UserRow key={user._id}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2">
                Skills: {user.skills.join(", ")}
              </Typography>

              <FormControl sx={{ mt: 1, minWidth: 180 }}>
                <InputLabel>{user.name}'s Skill</InputLabel>
                <Select
                  value={receiverSkill[user._id] || ""}
                  onChange={(e) =>
                    setReceiverSkill((prev) => ({
                      ...prev,
                      [user._id]: e.target.value,
                    }))
                  }
                  label={`${user.name}'s Skill`}
                >
                  {user.skills.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => sendSkillRequest(user._id)}
              sx={{ ml: 2, height: "40px" }}
            >
              Send Request
            </Button>
          </UserRow>
        ))}
      </Container>

      <Snackbar
        open={popupOpen}
        autoHideDuration={3000}
        onClose={() => setPopupOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setPopupOpen(false)} severity="success">
          Request sent successfully!
        </Alert>
      </Snackbar>
    </GradientBackground>
  );
}
