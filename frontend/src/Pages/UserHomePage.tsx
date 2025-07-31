import React, { useCallback, useEffect, useState } from "react";
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
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [cost, setCost] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");

  //  State to hold all expenses fetched from the backend
  const [allExpenses, setAllExpenses] = useState<Expenses[]>([]);
  // State to manage loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to track total spent
  const [totalCost, setTotalCost] = useState<number>(0);

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

  //useCallback prevents re-creating the function on every render unless its dependencies change, improving performance when passing it to child components.
  const fetchTotalCost = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/expense/total-expenses",
        { withCredentials: true }
      );

      const totalCost = response.data.total_expenses;
      setTotalCost(totalCost);
      console.log("total cost is:", totalCost);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch total cost:", error);
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  }, []);
  useEffect(() => {
    fetchTotalCost();
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
      await fetchTotalCost();

      // Clear the form after adding an expense
      setName("");
      setCategory(""); //check again its a dropdown i need to reset it aswell visually not only state
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
        maxWidth: 1200,
        mx: "auto",
        px: 2,
        mt: { xs: 4, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        minHeight: "80vh",
      }}
    >
      {/* Form Box */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 30%" },
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "background.paper",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { md: "500px" },
          maxHeight: { md: "600px" },
          overflowY: "auto",
        }}
      >
        <PageHeader
          variant="h5"
          align="center"
          sx={{
            color: "#0a9396",
            fontWeight: 600,
            mb: 4,
            textTransform: "uppercase",
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Add Expense
        </PageHeader>

        <TextField
          id="expense"
          name="expense"
          label="What did you buy?"
          variant="standard"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 5 }}
          required
        />

        <FormControl fullWidth variant="standard" required sx={{ mt: 2 }}>
          <InputLabel id="categoryDropdown">Choose a category</InputLabel>
          <Select
            labelId="categoryDropdown"
            id="category"
            value={category}
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
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value) || "")}
          required
          sx={{ mt: 2 }}
        />

        <BtnComp
          type="submit"
          variant="contained"
          sx={{ width: "50%", mt: 7, backgroundColor: "#0a9396" }}
        >
          Add Expense
        </BtnComp>

        <Message message={message} />
      </Box>

      {/* Expenses Table Panel */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 70%" },
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "background.paper",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { md: "500px" },
          maxHeight: { md: "600px" },
          overflowY: "auto",
        }}
      >
        <PageHeader
          variant="h5"
          align="center"
          sx={{
            color: "#0a9396",
            fontWeight: 600,
            mb: 2,
            textTransform: "uppercase",
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Your Expenses
        </PageHeader>
        <Box sx={{ width: "100%", mt: 2 }}>
          <ExpensesPanel
            isLoading={isLoading}
            allExpenses={allExpenses}
            setAllExpenses={setAllExpenses}
            totalCost={totalCost}
            fetchTotalCost={fetchTotalCost}
          />
        </Box>
      </Box>
    </Box>
  );
}
