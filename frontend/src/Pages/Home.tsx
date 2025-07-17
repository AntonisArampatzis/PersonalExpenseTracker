import React, { useEffect, useState } from "react";
import PageHeader from "../Components/PageHeader";
import axios from "axios";
import {
  Box,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import BtnComp from "../Components/BtnComp";
import Message from "../Components/Message";
import ExpensesPanel from "../Components/ExpensesPanel";
import { Expenses } from "../types/Expenses";

export default function Home() {
  const [name, setName] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [cost, setCost] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");

  //  State to hold all expenses fetched from the backend
  const [allExpenses, setAllExpenses] = useState<Expenses[]>([]);
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all expenses for the logged-in user
  const getAllExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:5000/expense/get-expenses",
        { withCredentials: true }
      );
      // Store fetched expenses in state
      setAllExpenses(response.data);
      // setAllExpenses((prev) => [...prev, response.data.expense_data]);
    } catch (error: any) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, []);

  // Handle the submit of new expense
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/expense/add-expense",
        { name, category, cost },
        { withCredentials: true }
      );

      const message = response.data.message;
      setMessage(message);
      // Call getAllExpenses useEffect on submition to live update the table
      await getAllExpenses();

      // Clear the form after adding an expense
      setName("");
      setCategory("");
      setCost("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Request failed.");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  };

  return (
    // Outer Box
    <Box
      sx={{
        maxWidth: 1200, // px max width for the container
        minHeight: "100vh",
        width: "100%",
        mx: "auto",
        px: 2,
        pt: { xs: 10, md: 5 },
      }}
    >
      {/* Inner box that splits into Expenses form and Expenses table */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
          mb: 4,
          mt: 4,
          height: { md: "600px" }, // fixed height on desktop, auto on mobile
        }}
      >
        {/* Form Box */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // vertical center inside fixed height
            alignItems: "center", // horizontal center inside fixed width
            borderRadius: "25px",
            boxShadow: "5px 5px 6px grey",
            p: { xs: 2, md: 4 },
            maxHeight: "100%", // fill parent's height
            overflowY: "auto", // scroll if needed
            bgcolor: "background.paper", // or custom bg color
          }}
        >
          <PageHeader variant="h5" align="center">
            Add Expense
          </PageHeader>

          <TextField
            id="expense"
            name="expense"
            label="What did you buy?"
            variant="standard"
            type="text"
            fullWidth
            sx={{ mt: { xs: 5, md: 3 } }}
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <FormControl
            fullWidth
            margin="normal"
            variant="standard"
            sx={{ mt: { xs: 5, md: 3 } }}
            required
          >
            <InputLabel id="categoryDropdown">Choose a category</InputLabel>
            <Select
              labelId="categoryDropdown"
              id="category"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ textAlign: "left" }}
            >
              <ListSubheader>----- Food & Drink -----</ListSubheader>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Coffee and Drinks">Coffee and Drinks</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>

              <ListSubheader>----- Essentials -----</ListSubheader>
              <MenuItem value="Rent / Mortgage">Rent / Mortgage</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Groceries">Groceries</MenuItem>

              <ListSubheader>----- Lifestyle -----</ListSubheader>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Subscriptions">Subscriptions</MenuItem>
              <MenuItem value="Personal Care">Personal Care</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="cost"
            name="cost"
            label="How much did it cost?"
            variant="standard"
            type="number"
            fullWidth
            sx={{ mt: { xs: 5, md: 3 } }}
            value={cost || ""}
            onChange={(e) => setCost(parseInt(e.target.value))}
            required
          />

          <BtnComp
            type="submit"
            variant="contained"
            sx={{ mt: 5, width: "30%", backgroundColor: "#0a9396" }}
          >
            add expense
          </BtnComp>

          <Message message={message} />
        </Box>

        {/* Expenses Table Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, md: 4 },
            bgcolor: "background.paper",
            borderRadius: "25px",
            boxShadow: "5px 5px 6px grey",
            maxHeight: { md: "600px" },
            overflowY: "auto",
          }}
        >
          <PageHeader variant="h5" align="center">
            Your Expenses
          </PageHeader>
          <Box sx={{ width: "100%", mt: 2 }}>
            <ExpensesPanel
              isLoading={isLoading}
              allExpenses={allExpenses}
              setAllExpenses={setAllExpenses}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
