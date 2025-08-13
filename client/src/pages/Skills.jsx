// src/pages/Skills.jsx
import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import SkillCard from "../components/SkillCard";
import API from "../services/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    API.get("/skills")
      .then((res) => setSkills(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleRequest = async (skill) => {
    try {
      await API.post("/requests", { skillId: skill._id });
      alert("Request sent!");
    } catch (err) {
      alert("Error sending request");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container>
        {skills.map((skill) => (
          <Grid item key={skill._id}>
            <SkillCard skill={skill} onRequest={handleRequest} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}