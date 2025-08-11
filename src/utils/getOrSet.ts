import { redis } from "../lib/redisClient"

export async function getOrSet<T>(key: string, cb: () => T) {
    try {
        const data = await redis.get(key)
        if(data !== null) {
            return JSON.stringify(data) as T
        }
        
        const newData = cb();
        await redis.set("key", JSON.stringify(newData))
        return null
    } catch (error) {
        throw (error)
    }
}