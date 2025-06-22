import { PrismaClient } from "@prisma/client";
import { prisma } from "./prismaConn";
import { verifyToken } from "../services/jwtUtils";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthService } from "../services/authService";

export type GraphQLContext = {
    prisma: PrismaClient
    userId?: string
    authorId?: string
    role?: "Admin" | "Reader" | "Author"
    tokenExpired?: boolean
    services: {
        authService: AuthService;
    }
}

const authService = new AuthService(prisma);

export async function createContext({req}: {req: Request}): Promise<GraphQLContext> {
    const authHeaders = req.headers.get("Authorization");
    const token = authHeaders?.split(" ")[1]

    if(!token){
        return {prisma, 
            services: {
                authService
            } 
        }
    }

    try {
        const decoded = verifyToken(token)
        return {
            prisma,
            userId: decoded.userId,
            authorId: decoded.userId,
            role: decoded.role,
            services: {
                authService,
            },
        }
    } catch (err) {
        if(err instanceof TokenExpiredError){
            return {
                prisma, 
                tokenExpired: true, 
                services: {
                    authService
                }
            }
        }
        return {
            prisma, 
            services: {
                authService,
            },
        }
    }
}