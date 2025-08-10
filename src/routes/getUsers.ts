import { Router } from "express";
import { prisma } from '../lib/prismaConn';
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
    await client.connect();
    await client.flushAll()
    const result = await client.get('foo');
    console.log(result)  
    const ip = getClientIp(req)
    const hashedDP = createHashedClientSignature(req)
    const { country, regionName, city} = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`).then( (data) =>  data.json())
    return res.status(200).json({success: true, data: {ip, country, regionName, city, device_hash: hashedDP,}})
});
