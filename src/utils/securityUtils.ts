import { Request } from "express";
import crypto from "crypto"

export function getClientIp(req: Request) {
    const forwarded = req.headers["x-forwarded-for"]
    return Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0] || req.socket.remoteAddress;
}

export function createHashedClientSignature (req: Request) {
    const deviceFingerprint = {
        userAgent: req.headers["user-agent"] || "",
        acceptLang: req.headers["accept-language"] || "",
        accept: req.headers["accept"] || "",
        acceptEncoding: req.headers["accept-encoding"] || "",
        dnt: req.headers["dnt"] || "",
        secChUa: req.headers["sec-ch-ua"] || "",
        secChUaPlatform: req.headers["sec-ch-ua-platform"] || "",
        secChUaMobile: req.headers["sec-ch-ua-mobile"] || "",
    }
    const parsedDF = JSON.stringify(deviceFingerprint)
    return crypto.createHash("sha256").update(parsedDF).digest("hex")
}