import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminUserList from "../Components/AdminUserList";
import { Users } from "../types/Users";
import AdminExpenseList from "../Components/AdminExpenseList";
import PageHeader from "../Components/PageHeader";

export default function AdminHomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // centers container vertically in parent
        alignItems: "center", // centers container horizontally
        px: 2,
      }}
    >
      <PageHeader
        variant="h4"
        align="center"
        sx={{
          color: "#0a9396", // Soothing greenish-blue
          fontWeight: 600, // Slightly bold
          mb: { xs: 2 }, // Margin bottom for spacing
          mt: { xs: 2 },
          textTransform: "uppercase", // Optional: gives it a strong heading look
          fontSize: { xs: "1rem", md: "2rem" }, // Responsive sizing
        }}
      >
        Admin Dashboard
      </PageHeader>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 3, md: 6 },
          width: "100%",
          maxWidth: 1400, // increased max width for more space
          p: { xs: 3, md: 5 },
          mt: 1,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          minHeight: { xs: "auto", md: 600 }, // increased height for desktop
          overflow: "hidden",
        }}
      >
        {/* User List Panel */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            // overflowY: "auto", // enable vertical scrolling inside panel if needed
            px: 1,
          }}
        >
          <PageHeader
            variant="h5"
            align="center"
            sx={{
              color: "#0a9396", // Soothing greenish-blue
              fontWeight: 600, // Slightly bold
              mb: 2, // Margin bottom for spacing
              textTransform: "uppercase", // Optional: gives it a strong heading look
              fontSize: { xs: "1rem", md: "1.5rem" }, // Responsive sizing
            }}
          >
            User List
          </PageHeader>
          <AdminUserList />
        </Box>

        {/* Expenses List Panel */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            // overflowY: "auto",
            px: 1,
          }}
        >
          <PageHeader
            variant="h5"
            align="center"
            sx={{
              color: "#0a9396", // Soothing greenish-blue
              fontWeight: 600, // Slightly bold
              mb: 2, // Margin bottom for spacing
              textTransform: "uppercase", // Optional: gives it a strong heading look
              fontSize: { xs: "1rem", md: "1.5rem" }, // Responsive sizing
            }}
          >
            Expenses List
          </PageHeader>
          <AdminExpenseList />
        </Box>
      </Box>
    </Box>
  );
}
