import { PrismaClient } from "@prisma/client"
import { createAccessToken, createRefreshToken } from "./jwtUtils";
import bcrypt from "bcrypt"

function response(success: boolean, message: string, accessToken: string | null, refreshToken: string | null) {
    return {
        success,
        message,
        accessToken,
        refreshToken
    }
}

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async login (email: string, password: string) {
        const user = await this.prisma.user.findUnique({where: {email}});

        if(!user || (!await bcrypt.compare(user.password, password) )) {
            return response(false, "Incorrect email or password.", null, null);
        }

        const payload = {
            userId: user.id,
        }

        return response(true, "Login successful.", createAccessToken(payload), createRefreshToken(payload));
    }

}