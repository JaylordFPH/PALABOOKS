import { PrismaClient } from "@prisma/client"
import { signToken } from "./jwtUtils";

function response(success: boolean, message: string, token: string | null){
    return {
        success,
        message,
        token
    }
}

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async login (email: string, password: string) {
        const user = await this.prisma.user.findUnique({where: {email}});
        if(!user) {
            return response(false, "No user found.", null)
        }

        if(user.password !== password) {
            return response(false, "Incorrect email or password.", null);
        }

        return signToken(user.id)
    }

}