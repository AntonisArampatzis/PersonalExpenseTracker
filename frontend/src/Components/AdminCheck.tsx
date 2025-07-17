import { CircularProgress } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type AdminCheckProps = {
  isAdmin: boolean;
  isLoading: boolean;
};

export default function AdminCheck({ isAdmin, isLoading }: AdminCheckProps) {
  if (isLoading) {
    return <CircularProgress />;
  } else {
    return isAdmin ? <Outlet /> : <Navigate to="/home" replace />;
  }
}
