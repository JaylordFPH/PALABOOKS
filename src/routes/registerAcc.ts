import { Router, Request, Response } from "express";
import { isValidInput, isValidEmail } from "../utils/validators";
import { prisma } from "../lib/prismaConn";


export const registerAccRouter = Router();

registerAccRouter.post("/", async (req: Request, res: Response) => {
    const {username, email, password, dob} = req.body;

    if(!isValidInput(username) || !isValidInput(email) || !isValidInput(password) || !isValidInput(dob)) {
        return res.status(400).json({ error: "Invalid input." });   
    }
    
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email." });
    }

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password,
                dob: new Date(dob),
            },
        });
        return res.status(201).json({ user });
    } catch (error) {
        console.error("Error registering account:", error);
        return res.status(500).json({ error: "Internal server error." });
    }

})