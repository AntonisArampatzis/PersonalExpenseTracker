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
};

export default function Navbar({ setIsLogged }: NavbarProps) {
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
    <AppBar
      position="static"
      elevation={0} // Makes it blend with background
      sx={{
        bgcolor: "#f8f9fa",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton size="large" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem key="logout" onClick={handleLogout}>
                <Typography textAlign="center" color="#0a9396">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{ display: { md: "flex", sm: "none" }, alignItems: "center" }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                color: "#0a9396",
                cursor: "pointer",
              }}
              onClick={handleLogoClick}
            >
              PersonalExpenseTracker
            </Typography>

            <Button
              onClick={handleLogout}
              sx={{ px: 2, py: 1, color: "#0a9396", display: "block" }}
            >
              Logout
            </Button>
          </Box>
          <Message message={message} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
