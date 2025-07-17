import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Expenses } from "../types/Expenses";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// type AdminUserListProps = {
//   allUsers: Users[];
//   setAllUsers: React.Dispatch<React.SetStateAction<Users[]>>;
// };

export default function AdminExpenseList() {
  const [allExpenses, setAllExpenses] = useState<Expenses[]>([]);
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/admin/all-expenses",
        {
          withCredentials: true,
        }
      );
      setAllExpenses(response.data.all_expenses); // assuming backend sends { all_users: [...] }
    } catch (error: any) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const columns: GridColDef[] = [
    // { field: "id", headerName: "Expense ID", flex: 3 },
    { field: "id", headerName: "Name", flex: 2 },
    { field: "category", headerName: " Category", flex: 2 },
    { field: "cost", headerName: "Cost", flex: 1 },
    { field: "user_email", headerName: "User", flex: 2 },
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

  const rows = allExpenses.map((expense) => ({
    // id: expense.expense_id,
    id: expense.name,
    category: expense.category,
    cost: expense.cost,
    user_email: expense.user_email,
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
