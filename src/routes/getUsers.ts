import { Router } from "express";
import { prisma } from '../lib/prismaConn';
export const getUsersRouter = Router();

getUsersRouter.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
            },
        });
        
        return res.status(200).json({success: true,message: "Users fetched successfully", data: users});
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({success: false, message: "Failed to fetch users", data: null});
    }
});
