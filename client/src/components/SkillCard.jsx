// src/components/SkillCard.jsx
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function SkillCard({ skill, onRequest }) {
  return (
    <Card sx={{ maxWidth: 300, margin: 2 }}>
      <CardContent>
        <Typography variant="h6">{skill.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {skill.description}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 1 }}
          onClick={() => onRequest(skill)}
        >
          Request Swap
        </Button>
      </CardContent>
    </Card>
  );
}