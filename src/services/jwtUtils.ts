import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv"
dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET

interface TokenPayload {
    userId: string
}

type TokenWithClaims = TokenPayload & {
    iat?: number
    exp?: number
    bf?: number
}


export function checkToken(userId: string | undefined, tokenExpired?: boolean){
    if(tokenExpired){
        throw new GraphQLError("Session expired", {
            extensions: {
                code: "TOKEN_EXPIRED"
            }
        })
    }

        if(!userId) {
        throw new GraphQLError("Unauthenticated", {
            extensions: {
                code: "UNAUTHENTICATED"
            }
        })
    }
}

export function createAccessToken(payload: { userId: string }): string {
    if (!ACCESS_TOKEN) {
        throw new GraphQLError("ACCESS_TOKEN_SECRET is not defined in environment variables.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
    }

    try {
        return jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "15min" });
    } catch (err) {
        throw new GraphQLError("Failed to create access token: " + (err instanceof Error ? err.message : String(err)), {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
    }
}

export function createRefreshToken(payload: {userId: string,}) {
    if (!REFRESH_TOKEN) {
        throw new GraphQLError("REFRESH_TOKEN_SECRET is not defined in environment variables.", {
            extensions: {
                code: "INTERNAL_SERVER_ERROR"
            }
        })
    }

    try {
        return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "7d" });
    } catch (err) {
        throw new GraphQLError("Failed to create refresh token: " + (err instanceof Error ? err.message : String(err)), {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
    }
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_TOKEN!) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, REFRESH_TOKEN!) as TokenPayload;
}

export function decodeToken(token: string): TokenWithClaims {
    return jwt.decode(token) as TokenWithClaims;
}

export function stripTokenClaims(payload: TokenWithClaims): TokenPayload {
    return {
        userId: payload.userId
    }
}