import { PrismaClient } from "@prisma/client";
import { prisma } from "./prismaConn";
import { verifyAccessToken } from "../services/jwtUtils";
import { AuthService } from "../services/authService";
import { UserService } from "../services/userSerivce";

export type GraphQLContext = {
    prisma: PrismaClient
    userId?: string
    tokenExpired?: boolean
    services: {
        authService: AuthService;
        userService?: UserService;
    }
}

const authService = new AuthService(prisma);
const userService = new UserService(prisma);

export async function createContext({req}: {req: Request}): Promise<GraphQLContext> {
    const authHeaders = req.headers.get("Authorization");
    const token = authHeaders?.split(" ")[1]

    if(!token){
        return {
            prisma, 
            services: {
                authService,
                userService
            } 
        }
    }

    try {
        const decoded = verifyAccessToken(token) //will throw an error if token is invalid or expired
        return {
            prisma,
            userId: decoded.userId,
            services: {
                authService,
                userService
            },
        }
    } catch (err) {
        if(err instanceof Error && err.name === "TokenExpiredError"){
            return {
                prisma, 
                tokenExpired: true, 
                services: {
                    authService,
                    userService
                }
            }
        }
        //fallback for invalid token
        return {
            prisma, 
            services: {
                authService,
                userService
            },
        }
    }
}