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
