import { Router } from "express";
import { prisma } from '../lib/prismaConn';
import { isValidInput, isValidEmail } from "../utils/validators";

export const deleteUsersRouter = Router();

deleteUsersRouter.delete("/", async (req, res) => {
    const { email } = req.body;
    
    if(!email) {
        return res.status(400).json({ success: false, message: "Email is required", data: null });
    }

    if (!isValidInput(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await prisma.user.delete({
            where: { email },
        });

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ success: false, message: "Failed to delete user" });
    }
});
