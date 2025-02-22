import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from './route.mjs' 

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

// Add Expense
app.post("/addExpense", async (req, res) => {
  const { name, amount, category, createdAt, description, userId } = req.body;

  if (!name || !amount || !category || !createdAt || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newExpense = await prisma.expense.create({
      data: { name, amount, category, createdAt : createdAt ? new Date(createdAt) : new Date(), description, userId },
    });

    res.json(newExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding expense", error });
  }
});

//Get All Expenses for a User
app.get("/expenses/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// Editt expense
app.put("/expense/:expenseId", async (req, res) => {
  const { expenseId } = req.params;
  const { name, amount, category, createdAt, description } = req.body;

  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { name, amount, category, createdAt : createdAt ? new Date(createdAt) : new Date(), description },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
});


// Delete Expense
app.delete("/expense/:expenseId", async (req, res) => {
  const { expenseId } = req.params;

  try {
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});


app.listen(5001, () => console.log("Server running on port 5001"));
