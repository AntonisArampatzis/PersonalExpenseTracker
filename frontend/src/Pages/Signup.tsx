import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Container, Typography, Link } from "@mui/material";
import "../assets/Styles/Signup.css";
import BtnComp from "../Components/BtnComp";
import PageHeader from "../Components/PageHeader";
import Message from "../Components/Message";
import AuthLinkHelper from "../Components/AuthLinkHelper";

export default function Signup() {
  //1 after making the form with mui im setting up usestates for each field
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");

  //2 making handleSignUp

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      //3 make axios.post to backend link with the data from the useStates
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/register",
        { email, firstName, lastName, password1, password2 },
        { withCredentials: true }
      );

      console.log(response.data.message || "Signup successful!");
      setMessage(response.data.message || "Signup successful!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.error);
        setMessage(error.response?.data?.error);
      } else {
        console.log("Error connecting to server.");
        setMessage("Error connecting to server.");
      }
    }
  };

  return (
    <Container
      id="outer-container"
      sx={{
        minHeight: "100vh",
        width: "100%", // good, not vw
        overflowX: "hidden", // enough to hide horizontal overflow
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", md: "center" }, // top on mobile, center on desktop
        mt: { xs: 10, md: -5 }, // smaller top margin on mobile, none on desktop
      }}
    >
      <Box
        id="signup-form"
        component="form"
        noValidate
        sx={{
          width: "100%",
          maxWidth: { xs: "95%", sm: "28rem" }, // 95% width on tiny screens, fixed max on bigger
          mx: "auto",
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 5 },
          mt: { xs: 10, md: 5 },
        }}
        onSubmit={handleSignUp}
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
          CREATE ACCOUNT
        </PageHeader>

        <TextField
          id="email"
          name="email"
          label="Email"
          variant="standard"
          type="email"
          fullWidth
          sx={{ mt: 3 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email" //autoComplete tells the browser to show saved suggestions from previous form fills - there are specific html values for autoComplete
          required
        />

        <TextField
          id="firstName"
          label="First Name"
          variant="standard"
          type="text"
          fullWidth
          sx={{ mt: 3 }}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          required
        />

        <TextField
          id="lastName"
          label="Last Name"
          variant="standard"
          type="text"
          fullWidth
          sx={{ mt: 3 }}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          required
        />

        <TextField
          id="password1"
          label="Enter Password"
          variant="standard"
          type="password"
          fullWidth
          sx={{ mt: 3 }}
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          autoComplete="new-password"
          required
        />

        <TextField
          id="password2"
          label="Confirm Password"
          variant="standard"
          type="password"
          fullWidth
          sx={{ mt: 3 }}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
          required
        />

        <AuthLinkHelper href="/">Already registered? Log in </AuthLinkHelper>

        <BtnComp
          type="submit"
          variant="contained"
          sx={{
            mt: { xs: 3, md: 7 },
            width: "100% ",
            backgroundColor: "#0a9396",
          }}
        >
          REGISTER
        </BtnComp>

        <Message message={message} />
      </Box>
    </Container>
  );
}
