import { Router } from "express";
import { redis } from "../lib/redisClient";
import { getClientIp, createHashedClientSignature } from "../utils/securityUtils";
import {createClient} from "redis"

export const getUsersRouter = Router();
const client = createClient({
    username: 'default',
    password: "OVsVqdYbSmBmcS2nIdQtSJI5jzUNktqm",
    socket: {
        host: 'redis-11291.c322.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 11291
    }
});

client.on('error', err => console.log('Redis Client Error', err));


getUsersRouter.get("/", async (req, res) => {  
    try {
        const cachedPhotos = await redis.get("photos");

        if (cachedPhotos) {
            // Return parsed cached data
            const parsedPhotos = JSON.parse(cachedPhotos)
            const start = 0
            const limit = 10
            const photos = parsedPhotos.slice(start, limit)
            return res.status(200).json({ data: photos});
        }

        // If not in cache, fetch from API
        const data = await fetch("https://jsonplaceholder.typicode.com/photos")
            .then(res => res.json());

        // Store in Redis (as string)
        await redis.set("photos", JSON.stringify(data), { EX: 3600 }); // expire in 1 hour
    
        return res.status(200).json({ data });
    } catch (err) {
        console.error("Error fetching photos:", err);
        return res.status(500).json({ error: "Failed to fetch photos" });
    }
});
