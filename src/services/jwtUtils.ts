import jwt from "jsonwebtoken";
// import dontenv from "dotenv"
// dontenv.config()

const JWT_SECRET = process.env.ACESS_TOKEN_SECRET

interface DecodedToken {
    userId: string
    authorId?: string
    role?: "Admin" | "Reader" | "Author"
}

export function checkToken(userId: string){
    if(!userId){
        return {
            success: false,
            message: "Not authenticated",
            token: null
        }
    }
}

export function signToken(payload: {userId: string, authorId?: string}){
    return jwt.sign(payload, JWT_SECRET!, {expiresIn: "7d"});
}

export function verifyToken(token: string): DecodedToken {
    return jwt.verify(token, JWT_SECRET!) as DecodedToken;
}