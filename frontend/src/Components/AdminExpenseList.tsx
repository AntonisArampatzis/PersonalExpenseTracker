import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Expenses } from "../types/Expenses";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Message from "./Message";

export default function AdminExpenseList() {
  const [allExpenses, setAllExpenses] = useState<Expenses[]>([]);

  const [message, setMessage] = useState<string>("");

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/admin/all-expenses",
        {
          withCredentials: true,
        }
      );
      setAllExpenses(response.data.all_expenses);
    } catch (error: any) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDelete = async (expenseId: string) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/expense/delete-expense/${expenseId}`, //BACKTICKS-INSERTING VARIABLE
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setAllExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.expense_id !== expenseId)
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
    // { field: "id", headerName: "Expense ID", flex: 3 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "category", headerName: " Category", flex: 2 },
    { field: "cost", headerName: "Cost", flex: 1 },
    { field: "user_email", headerName: "User", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
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

  const rows = allExpenses.map((expense) => ({
    id: expense.expense_id,
    name: expense.name,
    category: expense.category,
    cost: expense.cost,
    user_email: expense.user_email,
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
