import { Box, Button, Container, Grid, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #000000, #0f2027, #203a43, #2c5364)", // black gradient
  color: "#fff",
  paddingBottom: "50px",
});

const SkillCard = ({ title, description }) => (
  <Card
    sx={{
      background: "rgba(255, 255, 255, 0.05)",
      color: "#fff",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.1)",
      "&:hover": { transform: "scale(1.05)", transition: "0.3s ease" },
    }}
  >
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#ccc" }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default function Home() {
  return (
    <GradientBackground>
      {/* Hero Section */}
      <Container sx={{ textAlign: "center", py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Swap Skills, Grow Together
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: "600px", mx: "auto", color: "#ccc", mb: 4 }}
        >
          Connect with people who have the skills you want to learn, and share your own expertise in return.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "8px",
          }}
        >
          Explore Skills
        </Button>
      </Container>

      {/* Skills Section */}
      <Container sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 4,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Popular Skills
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <SkillCard title="Web Development" description="Learn to build modern websites with experts." />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SkillCard title="Graphic Design" description="Enhance your design skills with creative minds." />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SkillCard title="Digital Marketing" description="Master SEO, social media, and online branding." />
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Container sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          About Skill Swap
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ maxWidth: "700px", mx: "auto", color: "#ccc" }}
        >
          Skill Swap is a platform that connects learners and teachers directly.
          Whether you want to learn a new language, code an app, or paint a masterpiece,
          you can find someone willing to teach you in exchange for your skills.
        </Typography>
      </Container>

      {/* Footer */}
      <Box sx={{ mt: 8, py: 3, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Typography variant="body2" color="#888">
          © {new Date().getFullYear()} Skill Swap | All Rights Reserved
        </Typography>
      </Box>
    </GradientBackground>
  );
}