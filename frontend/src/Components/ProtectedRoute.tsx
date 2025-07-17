import React, { ReactNode, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import Navbar from "./Navbar";
import axios from "axios";
import { Box } from "@mui/material";

type ProtectedRouteProps = {
  isLogged: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProtectedRoute({
  isLogged,
  isLoading,
  isAdmin,
  setIsLogged,
}: ProtectedRouteProps) {
  // Polling the backend every X seconds to verify if the user's token is still valid.
  useEffect(() => {
    if (!isLogged) return;

    const checkToken = setInterval(async () => {
      //one backend call to verify
      try {
        const verify_response = await axios.get(
          "http://127.0.0.1:5000/auth/verify-token",
          { withCredentials: true }
        );
        console.log("verify token call");
        setIsLogged(true);
        console.log("Status:", verify_response.data.message);
        console.log("User ID:", verify_response.data.user_id);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.log("Access Token expired");
            //401 = lacks proper authentication credentials or provided invalid credentials
            //backend call to refresh token
            try {
              const refresh_response = await axios.post(
                "http://127.0.0.1:5000/auth/refresh-token",
                {},
                { withCredentials: true }
              );
              console.log("refresh token call");
              console.log(refresh_response.data.message);

              // If refresh was successful backend call to verify token again
              const retry_verify_response = await axios.get(
                "http://127.0.0.1:5000/auth/verify-token",
                { withCredentials: true }
              );
              console.log("verify token call");
              setIsLogged(true);
              console.log("Status:", retry_verify_response.data.message);

              // If refresh fails Logout
            } catch {
              setIsLogged(false);
              console.log("Refresh failed — logging out.");
            }
          } else {
            // Some other API error
            setIsLogged(false);
            console.log("Other error:", error.response?.data?.error);
          }
        } else {
          // Not an axios error
          console.log("Non-axios error:", error);
        }
      }
    }, 300000); // every 5 min=300000

    return () => clearInterval(checkToken);
  }, [isLogged]);
  //forgot [] and had issues now it works,ths [] tells reacts to run useEffect only once,runs when isLogged is true

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return isLogged ? (
    <>
      <Navbar setIsLogged={setIsLogged} />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}
