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
  const { page = 1, limit = 5, start, end, category, searchQuery } = req.query; 

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [expenses, allExpenses] = await Promise.all([
      prisma.expense.findMany({
        where: {
          userId,
          ...(parseInt(start) != 0 && parseInt(end) != 0 ? { createdAt: { gte: new Date(start), lte: new Date(end) } } : {}),
          ...(category ? { category } : {}),
          ...(searchQuery ? {
            OR: [
              { description: { contains: searchQuery, mode: 'insensitive' } },
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { amount: { equals: parseFloat(searchQuery) } } // Assuming amount is a number
            ]
          } : {})
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: parseInt(limit),
      }),
      prisma.expense.findMany({ where: {
        userId,
        ...(parseInt(start) != 0 && parseInt(end) != 0 ? { createdAt: { gte: new Date(start), lte: new Date(end) } } : {}),
        ...(category ? { category } : {}),
        ...(searchQuery ? {
          OR: [
            { description: { contains: searchQuery, mode: 'insensitive' } },
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { amount: { equals: parseFloat(searchQuery) } } // Assuming amount is a number
          ]
        } : {})
      }
     }),
    ]);
    const totalexpense = allExpenses.reduce((acc, val) => acc + val.amount, 0)
    const total = allExpenses.length

    res.json({
      expenses,
      total,
      totalexpense,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error)
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
