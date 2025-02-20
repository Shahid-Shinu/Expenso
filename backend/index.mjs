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
  const { name, amount, category, description, userId } = req.body;

  if (!name || !amount || !category || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  console.log(name, amount, category, description, userId);

  try {
    const newExpense = await prisma.expense.create({
      data: { name, amount, category, description, userId },
    });

    res.json(newExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding expense", error });
  }
});

//Get All Expenses for a User
app.get('/getExpenses', async (req, res) => {
  const { userId } = req.query;
  const expenses = await prisma.expense.findMany({
    where: { userId }
  });
  res.json(expenses);
});

// Delete Expense
app.delete("/deleteExpenses", async (req, res) => {
  const { id } = req.query;
  await prisma.expense.delete({ where: { id } });
  res.json({ message: "Expense deleted" });
});

app.listen(5001, () => console.log("Server running on port 5001"));
