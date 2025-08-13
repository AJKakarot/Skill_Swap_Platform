import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%", bgcolor: "rgba(0,0,0,0.7)", color: "white" }}>
        <Typography variant="h4" mb={2} fontWeight="bold" align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "gray" } }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "gray" } }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, background: "linear-gradient(90deg, #ff416c, #ff4b2b)" }}>
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center" mt={2}>
          Don't have an account?{" "}
          <span style={{ color: "#ff416c", cursor: "pointer" }} onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}