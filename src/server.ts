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
            context: async ({req, res}) => await createContext({req, res}),
        })
    );
    
    httpServer.listen({port: process.env.PORT || 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`)
    });
};

const SHUTDOWN_TIMEOUT_MS = 10000
let isShuttingDown = false

const shutdown = async (signal: string, isFatal: boolean) => {
    if (isShuttingDown) return
    isShuttingDown = true;

    console.log(`🟡 Received ${signal}. Starting graceful shutdown...`)
    
    const shutdownTimeout = setTimeout(() => {
        console.error("🟡 Shutdown timeout reached. Forcing exit.")
        process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS) ;

    try {
        // Stop Apollo Server
        console.log('🔵 Stopping Apollo Server...')
        await server.stop();
        console.log('🟢 Apollo Server stopped')

        
        // Close HTTP server
        console.log('🔵 Closing HTTP server...')
        await new Promise<void>((resolve) => {
            // Check if server is still listening
            if (httpServer.listening) {
                httpServer.close((err) => {
                    if (err && (err as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') {
                        console.error('🟠 HTTP server close error:', err.message)
                    } 
                    console.log('🟢 Manually closed HTTP server.')
                    resolve()
                });
                
            } else {
                console.log('🔵 HTTP server already closed by Apollo plugin.')
                resolve()
            }
        });

        // Close database connections
        console.log("🔵 Disconnecting from database...")
        await prisma.$disconnect()
        console.log('🟢 Database disconnected')
        // Close Redis connection
        console.log('🔵 Closing Redis connection...')
        await redis.quit()
        console.log('🟢 Redis connection closed')
        
        clearTimeout(shutdownTimeout)

        if(isFatal) {
            console.log(`🔴 Server terminated due to fatal error.`);
            process.exit(1)
        } else {
            console.log("🟢 Server shut down gracefully")
            process.exit(0)
        }
    } catch (error) {
        clearTimeout(shutdownTimeout)
        console.error('🔴 Error during shutdown:', error)
        process.exit(1)
    }
}

process.once('SIGINT', (sig) => shutdown(sig, false))   
process.once('SIGTERM', (sig) => shutdown(sig, false)) 

process.on("uncaughtException", (error) => {
    console.log("🔴 Uncaught Exception:", error)
    shutdown("UNCAUGHT_EXCEPTION", true)
});

process.on("unhandledRejection", (error) => {
    console.log("🔴 Unhandled Rejection:", error);
    shutdown("UNHANDLED_REJECTION", true)
});
startServer().catch((error) => {
    console.error("🔴 Error starting server", error);
    process.exit(1); 
});