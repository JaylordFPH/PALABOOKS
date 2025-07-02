import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

const ACCESS_TOKEN = process.env.ACESS_TOKEN_SECRET
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


export function createAccessToken(payload: {userId: string}) {
    return jwt.sign(payload, ACCESS_TOKEN!, {expiresIn: "15min"});
}

export function createRefreshToken(payload: {userId: string,}) {
    return jwt.sign(payload, REFRESH_TOKEN!, {expiresIn: "7d"})
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, ACCESS_TOKEN!) as TokenPayload;
}

export function actionRefreshToken(token: string): TokenPayload {
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