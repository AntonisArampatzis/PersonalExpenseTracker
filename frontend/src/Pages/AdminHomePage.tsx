import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminUserList from "../Components/AdminUserList";
import { Users } from "../types/Users";
import AdminExpenseList from "../Components/AdminExpenseList";
import PageHeader from "../Components/PageHeader";

export default function AdminHomePage() {
  // const [allUsers, setAllUsers] = useState<Users[]>([]);

  // const fetchAllUsers = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:5000/admin/all-users",
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setAllUsers(response.data.all_users); // assuming backend sends { all_users: [...] }
  //   } catch (error: any) {
  //     console.error("Failed to fetch users:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllUsers();
  // }, []);

  // const columns: GridColDef[] = [
  //   { field: "id", headerName: "User ID", flex: 3 },
  //   { field: "email", headerName: "Email", flex: 2 },
  //   { field: "firstName", headerName: "First Name", flex: 2 },
  //   { field: "lastName", headerName: "Last Name", flex: 2 },
  // ];

  // const rows = allUsers.map((user) => ({
  //   id: user.user_id,
  //   email: user.email,
  //   firstName: user.firstName,
  //   lastName: user.lastName,
  // }));

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // horizontally center entire container
        alignItems: "center", // vertically center entire container
        px: 2,
        // bgcolor: "background.default",
      }}
    >
      <PageHeader variant="h4" align="center" sx={{ color: "#0a9396" }}>
        Admin Dashboard
      </PageHeader>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 3, md: 6 }, // gap between the two panels
          width: "100%",
          maxWidth: 1200, // max width to keep it neat on big screens
          p: { xs: 2, md: 4 },
          mt: 5,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          minHeight: { xs: "auto", md: 500 }, // fixed height on desktop for better alignment
        }}
      >
        <Box
          sx={{
            flex: 1,
            // overflowY: "auto",
            minHeight: 0,
          }}
        >
          <PageHeader variant="h5" align="center" sx={{ color: "#0a9396" }}>
            User List
          </PageHeader>
          <AdminUserList />
        </Box>

        <Box
          sx={{
            flex: 1,
            // overflowY: "auto",
            minHeight: 0,
          }}
        >
          <PageHeader variant="h5" align="center" sx={{ color: "#0a9396" }}>
            Expenses List
          </PageHeader>
          <AdminExpenseList />
        </Box>
      </Box>
    </Box>
  );
}
