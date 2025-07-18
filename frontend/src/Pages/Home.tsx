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
        maxWidth: 1200,
        mx: "auto", // center horizontally in viewport
        px: 2,
        mt: { xs: 4, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        gap: 4,
        minHeight: "80vh", // optional: ensures some vertical breathing room
      }}
    >
      {/* Form Box */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 30%" }, // 30% width desktop, full width mobile
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "background.paper",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // center horizontally inside form box
          justifyContent: "center", // center vertically if box taller
          gap: 3,
        }}
      >
        <PageHeader
          variant="h5"
          align="center"
          sx={{
            color: "#0a9396", // Soothing greenish-blue
            fontWeight: 600, // Slightly bold
            mb: 4, // Margin bottom for spacing
            textTransform: "uppercase", // Optional: gives it a strong heading look
            fontSize: { xs: "1rem", md: "1.5rem" }, // Responsive sizing
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
          flex: { xs: "1 1 100%", md: "0 0 70%" }, // 70% desktop, full width mobile
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "background.paper",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { md: "500px" }, // fixed height on desktop
          maxHeight: { md: "600px" }, // max height
          overflowY: "auto", // scroll if content too tall
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
  );
}
