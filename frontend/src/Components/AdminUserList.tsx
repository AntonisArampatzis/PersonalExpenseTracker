import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Users } from "../types/Users";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// type AdminUserListProps = {
//   allUsers: Users[];
//   setAllUsers: React.Dispatch<React.SetStateAction<Users[]>>;
// };

export default function AdminUserList() {
  const [allUsers, setAllUsers] = useState<Users[]>([]);
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/admin/all-users",
        {
          withCredentials: true,
        }
      );
      setAllUsers(response.data.all_users); // assuming backend sends { all_users: [...] }
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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
      renderCell: (params) => (
        <IconButton
          color="error"
          // onClick={() => handleDelete(params.row.id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const rows = allUsers.map((user) => ({
    id: user.user_id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }));
  return (
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
  );
}
