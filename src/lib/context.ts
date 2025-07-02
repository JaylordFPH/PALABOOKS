import { PrismaClient } from "@prisma/client";
import { prisma } from "./prismaConn";
import { verifyAccessToken } from "../services/jwtUtils";
import { AuthService } from "../services/authService";

export type GraphQLContext = {
    prisma: PrismaClient
    userId?: string
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
        const decoded = verifyAccessToken(token)
        return {
            prisma,
            userId: decoded.userId,
            services: {
                authService,
            },
        }
    } catch (err) {
        if(err instanceof Error && err.name === "TokenExpiredError"){
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