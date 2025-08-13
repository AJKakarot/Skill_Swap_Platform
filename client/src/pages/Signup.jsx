import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: ""
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill)
    };

    try {
      await axios.post("http://localhost:4000/api/auth/register", payload);
      setSuccess(true);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 30%, #1c1c1c 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          color: "white",
          borderRadius: 3
        }}
        elevation={6}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: "bold",
            color: "#ff4b2b"
          }}
        >
          Create Your Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Skills (comma separated)"
              name="skills"
              variant="outlined"
              value={formData.skills}
              onChange={handleChange}
              fullWidth
              placeholder="JavaScript, Node.js, React"
              required
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                background: "linear-gradient(90deg, #ff416c, #ff4b2b)"
              }}
            >
              Sign Up
            </Button>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "white" }}
            >
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#ff4b2b" }}>   
                Login   
                </Link> 
            </Typography>
            </Stack>
            </form> 
        </Paper>
    </Box>
    );
}

