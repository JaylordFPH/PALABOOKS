import {createClient} from "redis";

const password = process.env.REDIS_PASSWORD!
const host = process.env.REDIS_HOST!
const port = Number(process.env.REDIS_PORT!)

export const redis = createClient({
    password,
    socket: {
        host,
        port,
    }
});

redis.on("error", (err) => {
    console.log("Redis connection error:", err)
});

redis.connect();

