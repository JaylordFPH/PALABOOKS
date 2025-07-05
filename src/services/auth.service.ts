import { PrismaClient } from "@prisma/client"
import { createAccessToken, createRefreshToken } from "./jwtUtils";
import bcrypt from "bcrypt"
import { UserService } from "./user.serivce";

type Response = {
    success: boolean;
    message: string;
    accessToken: string | null;
    refreshToken: string | null;
}

function response(success: boolean, message: string, accessToken: string | null, refreshToken: string | null): Response {
    return {
        success,
        message,
        accessToken,
        refreshToken
    }
}

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async signIn (email: string, password: string): Promise<Response> { 
        if (!email?.trim() || !password?.trim()) {
            return response(false,  "Invalid email or password.", null, null)
        }

        const user = await this.prisma.user.findUnique({where: {email}});
        if(!user || (!await bcrypt.compare(password, user.password) )) { //plainText and hashed password comparison :D
            return response(false, "Incorrect email or password.", null, null);
        }

        const payload = {
            userId: user.id,
        }

        return response(true, "Login successful.", createAccessToken(payload), createRefreshToken(payload));
    }

    async signUp(username: string, email: string, password: string, gender: string, dob: string): Promise<Response> {
        if (!username?.trim() || !email?.trim() || !password?.trim() || !gender?.trim() || !dob?.trim()) {
            return response(false, "Missing required fields. Please fill in all registration details.", null, null)
        }
        
        const existingUser = await this.prisma.user.findUnique({where: {email}});
        if(existingUser) {
            return response(false, "Email already exists.", null, null);
        }

        const userService = new UserService(this.prisma);
        const user = await userService.createUser({username, email, password, gender, dob});

        return response(true, "User created successfully.", createAccessToken({userId: user.id}), createRefreshToken({userId: user.id}));
    }
}