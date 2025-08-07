import { ApolloServer } from '@apollo/server'
import {expressMiddleware } from "@as-integrations/express5"
import {ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { prisma } from './lib/prismaConn'
import { typeDefs } from './graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './graphql/resolvers'
import { router } from './routes'

console.log(process.env.DATABASE_URL);
const app = express()
const httpServer = http.createServer(app);
const server = new ApolloServer({ 
    typeDefs,
    resolvers,  
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], 
    
});

app.use(cors<cors.CorsRequest>({
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

    //start the http server
    httpServer.listen({port: process.env.PORT || 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphql`)
    });
    
    const shutdown = async () => {
        console.log("Shutting down server...");
        await server.stop();
        await prisma.$disconnect();
        console.log("Server shut down successfully.");
        process.exit(0); //successful shutdown
    }

    process.on('SIGINT', shutdown); //CTRL+C goods for manual user shutdown 
    process.on('SIGTERM', shutdown); //SIGTERM for graceful shutdown by process manager
};

startServer().catch(() => {
    console.error("Error starting server");
    process.exit(1); //exit with error code
});