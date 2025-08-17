import { redis } from "../lib/redisClient"
import { prisma } from "../lib/prismaConn";
import bcrypt from "bcrypt"
import { resilient } from "./resilient";
//used to get a data in redis and set if data not exist
export async function getOrSet<T>(key: string, cb: () => T): Promise<T|null> {
    try {
        const data = await redis.get(key)
        if(data !== null) {
            return JSON.stringify(data) as T
        }
        
        const newData = cb();
        await redis.set(key, JSON.stringify(newData))
        return null
    } catch (error) {   
        // improve this later
        throw (error)
    }
}

//login attempt
export async function getUserLoginCache (email: string, password: string, emailKey: string, geolocationKey: string, limit: number, ttl: number): Promise<LoginAttempt | null> {
    
    try {
        const cached = await redis.hGetAll(geolocationKey); 
        
        if (Object.keys(cached).length > 0) {
            console.log("HELLO")
            return {
                id: cached.id,
                password: cached.password ,
                login_id: cached.login_id ,
                ip: cached.last_ip,
                country: cached.last_country,
                region_name: cached.last_region_name,
                city: cached.last_city,
                device_hash: cached.last_device_hash,
            }
        };
        
        const user = await resilient(async () => {
            return await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password: true,
                last_login: {
                    select: {
                        id: true,
                        last_ip: true,
                        last_country: true,
                        last_region_name: true,
                        last_city: true,
                        last_device_hash: true
                    }
                }
            }
            })
        }, {retries: 3})

        //(await bcrypt.compare(password, user.password)
        if(!user || !user.last_login || password !== user.password) {
            console.log("wrong password")
            return null
        }
        

        await checkSWL(emailKey, limit, ttl)

        const toSave = {
            id: user.id,
            password: user.password,
            login_id: user.last_login.id,
            ip: user.last_login.last_ip,
            country: user.last_login.last_country,
            region_name: user.last_login.last_region_name,
            city: user.last_login.last_city,
            device_hash: user.last_login.last_device_hash,
        }
        
        const isSuccess = await hSetWithExpire(toSave, geolocationKey, ttl)

        if (!isSuccess) return null
        
        return toSave

    } catch (err) {
        console.error(`Saving last login info is failed for ${geolocationKey}:`, err)
        return null
    }
    
}

interface LoginAttempt  {
    id: string
    password: string
    login_id: string
    ip: string
    country: string
    region_name: string
    city: string
    device_hash: string
}

//redis with lua scripts
async function hSetWithExpire (obj: LoginAttempt , key: string, ttl: number) {

    const luaScript = `
      local key = KEYS[1]
      local ttl = tonumber(ARGV[1])

      redis.call("HSET", key, 
        "id", ARGV[2],
        "password", ARGV[3],
        "login_id", ARGV[4],
        "ip", ARGV[5],
        "country", ARGV[6],
        "region_name", ARGV[7],
        "city", ARGV[8],
        "device_hash", ARGV[9]
      )
      redis.call("EXPIRE", key, ttl)

      return 1
    `

    try {
        const result = await redis.eval(
            luaScript, 
            {
                keys: [key],
                arguments: [
                    ttl.toString(),
                    obj.id || "",
                    obj.password || "",
                    obj.login_id || "",
                    obj.ip || "",
                    obj.country || "",
                    obj.region_name || "",
                    obj.city || "",
                    obj.device_hash || "",
                ] 
            }
        );
        console.log(key)
        return result === 1
    } catch (err) {
        console.error(`Saving last login info is failed for ${key}:`, err)
        return false
    }
}


export async function checkSWL(key: string, limit: number, ttl: number) {
  const now = Date.now();
  const windowStart = now - ttl * 1000;

  const luaScript = `
      local key = KEYS[1]
      local windowStart = tonumber(ARGV[1])
      local limit = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local ttl = tonumber(ARGV[4])
      local uniqueValue = ARGV[5]

      redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)

      local currentCount = redis.call("ZCARD", key)
      if currentCount >= limit then
          return 0
      end

      redis.call("ZADD", key, now, uniqueValue)

      redis.call("EXPIRE", key, ttl)

      return 1
  `
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
          ttl.toString(),
          uniqueValue
        ]
      }
    );

    return result === 1
  } catch (err) {
    console.error(`Rate limit check is failed for ${key}:`, err)
    return true
  }
}