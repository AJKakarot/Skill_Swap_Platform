import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Requests from "./pages/Requests";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#121212",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideLayout && <Navbar />}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
      {!hideLayout && <Footer />}
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
