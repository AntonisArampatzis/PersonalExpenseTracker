import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Users } from "../types/Users";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Message from "./Message";

// type AdminUserListProps = {
//   allUsers: Users[];
//   setAllUsers: React.Dispatch<React.SetStateAction<Users[]>>;
// };

export default function AdminUserList() {
  const [allUsers, setAllUsers] = useState<Users[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/admin/all-users",
        {
          withCredentials: true,
        }
      );
      setAllUsers(response.data.all_users);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/admin/delete-user/${userId}`, //BACKTICKS-INSERTING VARIABLE
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== userId)
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Something went wrong.");
        console.error("Failed to delete:", error);
      } else {
        setMessage("Unexpected error occurred.");
        console.error("Non-Axios error:", error);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "User ID", flex: 3 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "firstName", headerName: "First Name", flex: 2 },
    { field: "lastName", headerName: "Last Name", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        if (params.row.role === "Admin") return null;
        return (
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  const rows = allUsers.map((user) => ({
    id: user.user_id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  }));
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 8 },
          },
        }}
        pageSizeOptions={[8]}
        // checkboxSelection
        sx={{ border: 0 }}
      />
      <Message message={message} />
    </>
  );
}
