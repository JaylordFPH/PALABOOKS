import { Router } from "express";
import { getClientIp, createHashedClientSignature } from "../utils/securityUtils";
import { isValidEmail, isValidInput } from "../utils/validators";
import { redis } from "../lib/redisClient"; 

export const loginRouter = Router();

const mockData = [
    {
        email: "test1@gmail.com", 
        password: "test1" 
    },
    {
        email: "test2@gmail.com", 
        password: "test2" 
    }
];

const lastLogin = [
    {
        ip: "::ffff:127.0.0.1",
        deviceHash: "893b392c947b456cb3c05a05b53b2a511e6e4515f2e6c3429a46633faaa3600a"
    }
];

// Limits
const HARD_GLOBAL_LIMIT = 100;
const GLOBAL_WINDOW = 60;

const SWL_IP_LIMIT = 50;
const SWL_DEVICE_LIMIT = 10;
const SWL_EMAIL_LIMIT = 5;
const SWL_TTL = 60;

async function checkSWL(key: string, limit: number, ttlSeconds: number): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - ttlSeconds * 1000;
    
    const luaScript = `
        local key = KEYS[1]
        local window_start = tonumber(ARGV[1])
        local limit = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local ttl = tonumber(ARGV[4])
        local unique_value = ARGV[5]
        
        redis.call('ZREMRANGEBYSCORE', key, 0, window_start)

        local current_count = redis.call('ZCARD', key)

        if current_count >= limit then
            return 0
        end

        redis.call('ZADD', key, now, unique_value)
        
        redis.call('EXPIRE', key, ttl)
        
        return 1
    `;
    
    try {
        const uniqueValue = `${now}-${Math.random()}`;

        const result = await redis.eval(
            luaScript,
            {
                keys: [key],
                arguments: [
                    windowStart.toString(),
                    limit.toString(),
                    now.toString(),
                    (ttlSeconds * 2).toString(),
                    uniqueValue
                ]
            }
        ) as number
        
        return result === 1;
        
    } catch (error) {
        console.error(`Rate limit check failed for key ${key}:`, error);
        // Fail open to prevent blocking during Redis issues
        return true;
    }
}


loginRouter.post("/", async (req, res) => {
    const { email, password } = req.body;
    const ip = getClientIp(req);
    const hashedDf = createHashedClientSignature(req);

    // Keys 
    const globalKey = `swl:login:global`;
    const ipKey = `swl:login:ip:${ip}`;
    const deviceKey = `swl:login:device:${hashedDf}`;
    const emailKey = `swl:login:email:${email}`;

    try {
        // Input validation first (fail fast)
        if (!isValidEmail(email) || !isValidInput(email)) {
            return res.status(400).json({ message: "Incorrect email or password." });
        }

        // Check global rate limit first (most restrictive)
        const isGlobalAllowed = await checkSWL(globalKey, HARD_GLOBAL_LIMIT, GLOBAL_WINDOW);
        if (!isGlobalAllowed) {
            return res.sendStatus(429);
        }

        // Check IP and device limits concurrently
        const [isIpAllowed, isDeviceAllowed] = await Promise.all([
            checkSWL(ipKey, SWL_IP_LIMIT, SWL_TTL),
            checkSWL(deviceKey, SWL_DEVICE_LIMIT, SWL_TTL)
        ]);

        if (!isIpAllowed || !isDeviceAllowed) {
            return res.sendStatus(429);
        }

        // User authentication
        const isUserExist = mockData.find((user) => user.email === email);
        if (!isUserExist) {
            return res.status(400).json({ message: "Incorrect email or password." });
        }

        if (isUserExist.password !== password) {
            // Email rate limiting for failed attempts
            const isEmailAllowed = await checkSWL(emailKey, SWL_EMAIL_LIMIT, SWL_TTL);
            if (!isEmailAllowed) {
                return res.sendStatus(429);
            }

            return res.status(400).json({ message: "Incorrect email or password." });
        }

        // Check for unusual login
        if (lastLogin[0].ip !== ip || lastLogin[0].deviceHash !== hashedDf) {
            return res.status(200).json({ message: "Unusual login detected. Not fatal.." });
        }

        return res.status(200).json({ message: "Login successfully." });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
});