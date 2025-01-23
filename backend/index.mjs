import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash password
  const user = await prisma.user.create({
    data: { username, password: hashedPassword }
  });
  res.json(user);
});


// Add Expense
app.post("/addExpense", async (req, res) => {
  const { amount, category, userId } = req.body;
  const expense = await prisma.expense.create({
    data: { amount, category, userId }
  });
  res.json(expense);
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
