import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('hehe',username, password)

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  const { password: password_, ...userWithoutPassword } = user;
  res.cookie("token", token, { httpOnly: true, secure: true }).json({ user: userWithoutPassword });
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};