import { Box, Typography, IconButton } from "@mui/material";
import { GitHub, LinkedIn, Google, Instagram } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #0f0f0f, #1a1a1a)",
        color: "#fff",
        rounded: "8px",
        p: .5,
        textAlign: "center",
        mt: "auto", // ✅ push footer to bottom without gap
      }}
    >
      {/* Links */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
        <IconButton
          component="a"
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff" }}
        >
          <GitHub />
        </IconButton>
        <IconButton
          component="a"
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff" }}
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          component="a"
          href="mailto:youremail@gmail.com"
          sx={{ color: "#fff" }}
        >
          <Google />
        </IconButton>
        <IconButton
          component="a"
          href="https://instagram.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#fff" }}
        >
          <Instagram />
        </IconButton>
      </Box>

      {/* Footer Text */}
      <Typography variant="body2">
        © {new Date().getFullYear()} SkillSwap — Built with ❤️
      </Typography>
    </Box>
  );
}
