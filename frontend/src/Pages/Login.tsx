import { Box, TextField, Container, Typography, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BtnComp from "../Components/BtnComp";
import PageHeader from "../Components/PageHeader";
import React from "react";
import Message from "../Components/Message";
import "../assets/Styles/Login.css";
import AuthLinkHelper from "../Components/AuthLinkHelper";

type LoginProps = {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ setIsLogged, setIsAdmin }: LoginProps) {
  //1 after making the form with mui im setting up usestates for each field
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  //2 making handleLogin

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      //3 make axios.post to backend link with the data from the useStates
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setIsLogged(true);
      const role = response.data.role;

      console.log("Logged user is :", response.data.logged_user);
      console.log("Logged user role is :", response.data.role);

      if (role === "Admin") {
        setIsAdmin(true);
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Login failed.");
      } else {
        setMessage("Error connecting to server");
      }
    }
  };

  return (
    <Container
      id="outer-container"
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden", //to hide horizontal overflow
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", md: "center" }, // top on mobile, center on desktop
        mt: { xs: 10, md: -5 }, // smaller top margin on mobile, none on desktop
      }}
    >
      <Box
        id="login-form"
        component="form"
        noValidate
        sx={{
          width: "100%",
          maxWidth: { xs: "95%", sm: "28rem" },
          mx: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          mt: { xs: 10, md: 5 },
        }}
        onSubmit={handleLogin}
      >
        <PageHeader
          variant="h4"
          sx={{
            color: "#0a9396", // Soothing greenish-blue
            fontWeight: 600, // Slightly bold
            mb: { xs: 2, md: 4 }, // Margin bottom for spacing
            mt: { xs: 2 },
            textTransform: "uppercase", // Optional: gives it a strong heading look
            fontSize: { xs: "1rem", md: "2rem" }, // Responsive sizing
          }}
          align="center"
        >
          LOGIN
        </PageHeader>

        <TextField
          id="email"
          name="email"
          label="Email"
          variant="standard"
          type="email"
          fullWidth
          sx={{ mt: { xs: 5, md: 3 } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required //checking if filled even tho i check in the api
        />

        <TextField
          id="password"
          label="Enter Password"
          variant="standard"
          type="password"
          fullWidth
          sx={{ mt: { xs: 5, md: 3 } }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required //checking if filled even tho i check in the api
        />

        <AuthLinkHelper href="/register">
          Don't have an account? Create one{" "}
        </AuthLinkHelper>

        <BtnComp
          type="submit"
          variant="contained"
          sx={{
            mt: { xs: 3, md: 7 },
            width: "100% ",
            backgroundColor: "#0a9396",
          }}
        >
          LOGIN
        </BtnComp>

        <Message message={message} />
      </Box>
    </Container>
  );
}
