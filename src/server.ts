import { ApolloServer } from '@apollo/server'
import {expressMiddleware } from "@as-integrations/express5"
import {ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { prisma } from './lib/prismaConn'
import { redis } from './lib/redisClient'
import { typeDefs } from './graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './graphql/resolvers'
import { router } from './routes'
import {config} from "dotenv"
config()
console.log(process.env.ACCESS_TOKEN_SECRET!)
const app = express()
app.set("trust proxy", true);
const httpServer = http.createServer(app);
const server = new ApolloServer({ 
    typeDefs,
    resolvers,  
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], 
    
});

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));

app.use(express.json())
app.use("/api", router)

async function startServer() {  
    await server.start();
    app.use('/graphql',
        expressMiddleware(server, {
            context: ({req, res}) => createContext({req, res}),
        })
    );

    httpServer.listen({port: process.env.PORT || 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`)
    });
    
    
    let isShutingDown = false;

    const shutdown = async () => {
        if(isShutingDown) return
        isShutingDown = true;

        console.log("Shutting down server...");
        try {
            await server.stop();
            console.log("Apollo Server stopped.");

            await prisma.$disconnect()
            console.log("Prisma disconnected.");

            await redis.quit()
            console.log("Redis connection closed.");

        } catch (err) {
            console.error("Error during shutdown:", err);
        } finally {
            console.log("Server shut down successfully.");
            // setTimeout(() => process.exit(0), 100);
        }
    }

    process.once('SIGINT', async () =>  { await shutdown() }); //CTRL+C goods for manual user shutdown 
    process.once('SIGTERM', async () => { await shutdown() }); //SIGTERM for graceful shutdown by process manager
};

startServer().catch(() => {
    console.error("Error starting server");
    process.exit(1); //exit with error code
});