import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './routes/graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './routes/graphql/resolvers'
import express, { Request, Response } from 'express'
import { refreshTokenRouter } from './routes/refreshToken'
import { uploadRouter } from './routes/upload'

const app = express()
app.use("/refresh-token", refreshTokenRouter)
app.use("/uploads", uploadRouter)

const server = new ApolloServer({ 
    typeDefs,
    resolvers,  
    context: ({ req, res }: { req: Request, res: Response }) => createContext({ req, res }),
    csrfPrevention: true
});

async function startServer() {  
    await server.start();
    server.applyMiddleware({
        app,
        cors: {
            origin: "*",
            credentials: true,
            methods: ['POST']
        }
    });

    app.listen({ port: 4000,}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        console.log(`🚀 GraphQL Playground available at http://localhost:4000${server.graphqlPath}`);
    });
};

startServer();