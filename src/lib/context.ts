import { PrismaClient } from "@prisma/client";
import { prisma } from "./prismaConn";
import { verifyAccessToken } from "../services/jwtUtils";
import { AuthService } from "../services/authService";
import { UserService } from "../services/userSerivce";
import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

export type GraphQLContext = {
    prisma: PrismaClient
    userId?: string
    tokenExpired?: boolean
    services: {
        authService: AuthService;
        userService: UserService;
    }
    res?: Response // Optional, if you need to set cookies or headers
}

const authService = new AuthService(prisma);
const userService = new UserService(prisma);

export async function createContext({req, res}: {req: Request, res: Response}): Promise<GraphQLContext> {
    const authHeaders = req.headers.authorization;
    const token = authHeaders?.split(" ")[1]

    if(!token){ 
        return {
            prisma, 
            services: {
                authService,
                userService
            },
            res
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
        if(err instanceof TokenExpiredError){
            return {
                prisma, 
                tokenExpired: true, 
                services: {
                    authService,
                    userService
                },
                res
            }
        }
        //fallback for invalid token
        return {
            prisma, 
            services: {
                authService,
                userService
            },
            res
        }
    }
}