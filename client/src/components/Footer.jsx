// src/components/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ p: 2, mt: 5, textAlign: "center", bgcolor: "#f5f5f5" }}>
      <Typography variant="body2">© {new Date().getFullYear()} Skill Swap Platform</Typography>
    </Box>
  );
}