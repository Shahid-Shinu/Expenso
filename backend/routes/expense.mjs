import express from 'express';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    const { start, end, category, searchQuery } = req.query; 

    try {
        const data = await prisma.expense.findMany({ where: {
            userId,
            ...(parseInt(start) != 0 && parseInt(end) != 0 ? { createdAt: { gte: new Date(start), lte: new Date(end) } } : {}),
            ...(category ? { category: {in: category.split(',')} } : {}),
            ...(searchQuery ? {
            OR: [
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { name: { contains: searchQuery, mode: 'insensitive' } },
            ]
            } : {})
        }
        })

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;
