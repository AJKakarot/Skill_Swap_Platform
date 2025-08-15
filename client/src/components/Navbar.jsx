// components/Navbar.js
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data) {
        setProfile(data);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("skills", JSON.stringify(data.skills || []));
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.clear();
    navigate("/login");
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);

    await fetch("http://localhost:4000/api/auth/upload-photo", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    fetchProfile(); // refresh after upload
  };

  if (!token) return null; // hide navbar if not logged in

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #000000, #0f2027, #203a43, #2c5364)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            component={Link}
            to="/home"
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#ffcc70",
                transform: "scale(1.05)",
              },
            }}
          >
            Skill Swap
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/home"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#ffcc70",
                  transform: "scale(1.05)",
                  textDecoration: "underline",
                },
              }}
            >
              Home
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/chat"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#70ffaf",
                  transform: "scale(1.05)",
                  textDecoration: "underline",
                },
              }}
            >
              Chat
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/requests"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#ffa970",
                  transform: "scale(1.05)",
                  textDecoration: "underline",
                },
              }}
            >
              Requests
            </Button>

            {profile?.email === "gajeet031@gmail.com" && (
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                    color: "white",
                    boxShadow: "0 0 10px #ff4b2b",
                    transform: "scale(1.07)",
                  },
                }}
              >
                Admin Dashboard
              </Button>
            )}

            {/* Navbar Avatar */}
            <Avatar
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 0 10px rgba(255,255,255,0.6)",
                },
              }}
              src={profile?.photo ? `http://localhost:4000/${profile.photo}` : ""}
              onClick={() => setOpen(true)}
            >
              {profile?.name?.[0]}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <Box
          sx={{
            background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
            color: "white",
            p: 3,
            textAlign: "center",
          }}
        >
          <DialogTitle sx={{ color: "white" }}>Profile</DialogTitle>
          <DialogContent>
            <label htmlFor="profile-upload">
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <Avatar
                sx={{
                  bgcolor: "#ff4b2b",
                  width: 80,
                  height: 80,
                  margin: "0 auto",
                  fontSize: 30,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    boxShadow: "0 0 12px #ff4b2b",
                  },
                }}
                src={profile?.photo ? `http://localhost:4000/${profile.photo}` : ""}
              >
                {profile?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </label>

            <Typography variant="h6" sx={{ mt: 2 }}>
              {profile?.name}
            </Typography>
            <Typography variant="body2">{profile?.email}</Typography>
            <Typography sx={{ mt: 1 }}>
              Skills: {profile?.skills?.join(", ") || "No skills added"}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 12px #ff4b2b",
                  transform: "scale(1.05)",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}
