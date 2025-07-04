import { Request, Response, Router } from "express";
import { stripTokenClaims, createRefreshToken, verifyRefreshToken } from "../services/jwtUtils";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export const refreshTokenRouter = Router();
refreshTokenRouter.post("/", async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: "No refresh token provided" });
        }
        
        const payload = verifyRefreshToken(refreshToken);
        const cleanPayload = stripTokenClaims(payload);
        const newRefreshToken = createRefreshToken(cleanPayload);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: "strict", // Adjust based on your CSRF protection needs
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/refresh-token", // Ensure the cookie is sent with requests to this path
        });

    } catch (error) {
        if(error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }
        console.error("Error refreshing token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});