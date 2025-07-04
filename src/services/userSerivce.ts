import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
interface User{
    id: string
    username: string
    email: string
    password: string
    gender: string
}

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async createUser(data: {username: string, email: string, password: string, gender: string, dob: string}): Promise<User> {
        const hashedPassword =  await bcrypt.hash(data.password, 10)
        return this.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword, 
                gender: data.gender,
                dob: new Date(data.dob)
            }
        })
    }
}