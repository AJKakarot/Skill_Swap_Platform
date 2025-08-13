// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Paper } from "@mui/material";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users"); // backend route to get all users
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const res = await API.get("/admin/info"); // backend route to get admin details
      setAdminInfo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAdminInfo();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Dashboard</Typography>

      {/* Admin Info */}
      {adminInfo && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Admin Info</Typography>
          <Typography>Email: {adminInfo.email}</Typography>
          <Typography>Name: {adminInfo.name}</Typography>
        </Paper>
      )}

      {/* User Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>All Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDelete(user._id)}>
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