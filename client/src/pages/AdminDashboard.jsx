// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  Paper,
  Avatar
} from "@mui/material";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("http://localhost:4000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const res = await API.get("http://localhost:4000/api/admin/adminInfo");
      setAdminInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
  
    try {
      await API.delete(`http://localhost:4000/api/admin/users/${userId}`); // matches router.delete("/users/:id")
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };
  

  useEffect(() => {
    fetchUsers();
    fetchAdminInfo();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          letterSpacing: 1,
          color: "#203a43",
        }}
      >
        Admin Dashboard
      </Typography>

    {/* Admin Info */}
{adminInfo && (
  <Paper
    sx={{
      p: 3,
      mb: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      color: "white",
      borderRadius: 3,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}
  >
    {/* Left: Info */}
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color: "#fff",
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        🛡️ Admin Info
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
        Email:{" "}
        <span style={{ fontWeight: "bold", color: "#4fd1c5" }}>
          {adminInfo.email}
        </span>
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
        Name:{" "}
        <span style={{ fontWeight: "bold", color: "#4fd1c5" }}>
          {adminInfo.name}
        </span>
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
        Skills:{" "}
        <span style={{ fontWeight: "bold", color: "#4fd1c5" }}>
          {adminInfo.skills.join(", ")}
        </span>
      </Typography>
    </Box>

    {/* Right: Profile Avatar */}
    <Avatar
      src={
        adminInfo.photo
          ? `http://localhost:4000/${adminInfo.photo}`
          : ""
      }
      sx={{
        width: 80,
        height: 80,
        border: "3px solid #ffcc70",
        boxShadow: "0 0 10px rgba(255,204,112,0.8)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.1)",
          boxShadow: "0 0 15px rgba(255,204,112,1)",
        },
      }}
    >
      {adminInfo.name?.charAt(0).toUpperCase()}
    </Avatar>
  </Paper>
)}

      {/* User Table */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#203a43",
        }}
      >
        All Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user._id)}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 0 10px rgba(255,0,0,0.5)",
                    },
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
