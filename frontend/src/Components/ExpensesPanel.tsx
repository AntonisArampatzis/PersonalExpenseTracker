import { Box, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Message from "./Message";
import { Expenses } from "../types/Expenses";

type ExpensesPanelProps = {
  isLoading: boolean;
  allExpenses: Expenses[];
  setAllExpenses: React.Dispatch<React.SetStateAction<Expenses[]>>;
};

function ExpensesPanel({
  isLoading,
  allExpenses,
  setAllExpenses,
}: ExpensesPanelProps) {
  const [message, setMessage] = useState<string>("");

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

  // Define Columns
  const columns: GridColDef[] = [
    // { field: "id", headerName: "id", width: 70 },
    { field: "name", headerName: "Expense Name", flex: 3 },
    { field: "category", headerName: "Category", flex: 2 },
    { field: "cost", headerName: "Cost", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Define Rows
  const rows = allExpenses.map((expense) => ({
    id: expense.expense_id,
    name: expense.name,
    category: expense.category,
    cost: expense.cost,
  }));

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          sx={{
            height: { xs: 300, md: 400 }, // smaller height on small screens, bigger on desktop
            maxWidth: "100%",
            overflowY: "auto",
            border: 0,
          }}
        />
      )}
      <Message message={message} />
    </Box>
  );
}
// React.memo is a performance optimization tool in React
// Wraps a component and tells React dont rerender if props dont change
export default React.memo(ExpensesPanel);
