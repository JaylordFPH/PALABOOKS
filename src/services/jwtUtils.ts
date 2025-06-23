import jwt from "jsonwebtoken";
// import dontenv from "dotenv"
// dontenv.config()
import { GraphQLError } from "graphql";

const JWT_SECRET = process.env.ACESS_TOKEN_SECRET

interface DecodedToken {
    userId: string
    authorId?: string
    role?: "Admin" | "Reader" | "Author"
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
        throw new GraphQLError("Not authenticated", {
            extensions: {
                code: "NOT_AUTHENTICATED"
            }
        })
    }
}


// export function isUserAuthorized(role: "Auther" | "Admin" | "Reader") {
//     if(!role)
// }

export function signToken(payload: {userId: string, authorId?: string}){
    return jwt.sign(payload, JWT_SECRET!, {expiresIn: "7d"});
}

export function verifyToken(token: string): DecodedToken {
    return jwt.verify(token, JWT_SECRET!) as DecodedToken;
}