import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import Message from "./Message";
import axios from "axios";

type NavbarProps = {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({ setIsLogged, setIsAdmin }: NavbarProps) {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    setMessage("");

    try {
      const logout_api = await axios.post(
        "http://127.0.0.1:5000/auth/logout",
        undefined,
        {
          withCredentials: true,
        }
      );

      console.log(logout_api.data.message);
      setMessage(logout_api.data.message);

      setTimeout(() => {
        setIsLogged(false); //this must be here,because backend deletes cookies so it instantly navigates me to login as planned
        setIsAdmin(false);
        navigate("/");
      }, 1500);
    } catch (error: unknown) {
      setMessage("Error logging out. Try again.");
      console.error(error);
    }
  };

  const handleLogoClick = async () => {
    navigate("/home");
  };

  return (
    // <AppBar
    //   position="static"
    //   elevation={0} // Makes it blend with background
    //   sx={{
    //     bgcolor: "#f8f9fa",
    //     zIndex: 1100,
    //   }}
    // >
    //   <Container maxWidth="xl">
    //     <Toolbar disableGutters>
    //       {/* LEFT SIDE: Logo */}
    //       <Box sx={{ display: "flex", alignItems: "center" }}>
    //         <Typography
    //           variant="h6"
    //           noWrap
    //           onClick={handleLogoClick}
    //           sx={{
    //             ml: 2,
    //             color: "#0a9396",
    //             cursor: "pointer",
    //             display: { xs: "none", md: "flex" },
    //           }}
    //         >
    //           PersonalExpenseTracker
    //         </Typography>
    //       </Box>

    //       {/* SPACER: Pushes logout to the right */}
    //       <Box sx={{ flexGrow: 1 }} />

    //       {/* RIGHT SIDE: Desktop Logout */}
    //       <Box
    //         sx={{
    //           display: { xs: "none", md: "flex" },
    //           alignItems: "center",
    //           mr: 2,
    //         }}
    //       >
    //         <Button
    //           onClick={handleLogout}
    //           sx={{
    //             px: 2,
    //             py: 1,
    //             color: "#0a9396",
    //             textTransform: "none",
    //           }}
    //         >
    //           Logout
    //         </Button>
    //       </Box>

    //       {/* RIGHT SIDE: Mobile Hamburger Menu */}
    //       <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
    //         <IconButton size="large" onClick={handleOpenNavMenu}>
    //           <MenuIcon />
    //         </IconButton>

    //         <Menu
    //           anchorEl={anchorElNav}
    //           open={Boolean(anchorElNav)}
    //           onClose={handleCloseNavMenu}
    //           anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    //           transformOrigin={{ vertical: "top", horizontal: "left" }}
    //         >
    //           <MenuItem key="logout" onClick={handleLogout}>
    //             <Typography textAlign="center" color="#0a9396">
    //               Logout
    //             </Typography>
    //           </MenuItem>
    //         </Menu>
    //       </Box>
    //       <Message/>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Left: Logo */}
          <Typography
            variant="h6"
            noWrap
            onClick={handleLogoClick}
            sx={{
              color: "#0a9396",
              cursor: "pointer",
              flexGrow: { xs: 1, md: 0 },
              textAlign: { xs: "center", md: "left" },
              display: "flex",
            }}
          >
            PersonalExpenseTracker
          </Typography>

          {/* Right: Logout (hides on mobile) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleLogout}
              sx={{
                px: 2,
                py: 1,
                color: "#0a9396",
                textTransform: "none",
              }}
            >
              LOGOUT
            </Button>
          </Box>

          {/* Right: Mobile menu (Logout only) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton size="large" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem key="logout" onClick={handleLogout}>
                <Typography textAlign="center" color="#0a9396">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Message message={message} />
    </Box>
  );
}
