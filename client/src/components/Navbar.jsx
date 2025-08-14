// components/Navbar.js
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email"); // ✅ Store email in localStorage after login

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email"); // clear email as well
    navigate("/login");
  };

  if (!token) return null; // hide navbar if not logged in

  return (
    <AppBar position="static" sx={{ backgroundColor: "#111" }}>
      <Toolbar>
      <Typography
  component={Link}
  to="/home"
  variant="h6"
  sx={{
    flexGrow: 1,
    textDecoration: "none", // removes underline
    color: "inherit",       // keeps text color same as theme
    cursor: "pointer"       // makes it look clickable
  }}
>
  Skill Swap
</Typography>
        <Box>
          <Button color="inherit" component={Link} to="/home">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/chat">
            Chat
          </Button>
          <Button color="inherit" component={Link} to="/requests">
            Requests
          </Button>

          {/* ✅ Show Admin Dashboard only for specific email */}
          {userEmail === "gajeet031@gmail.com" && (
            <Button color="inherit" component={Link} to="/admin">
              Admin Dashboard
            </Button>
          )}

          <Button color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
