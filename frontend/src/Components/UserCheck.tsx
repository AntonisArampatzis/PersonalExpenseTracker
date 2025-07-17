import { CircularProgress } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type UserCheckProps = {
  isAdmin: boolean;
  isLoading: boolean;
};

export default function UserCheck({ isAdmin, isLoading }: UserCheckProps) {
  if (isLoading) {
    return <CircularProgress />;
  } else {
    return !isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
  }
}
