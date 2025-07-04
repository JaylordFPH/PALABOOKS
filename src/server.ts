import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './graphql/resolvers'
import express, { Request, Response } from 'express'
import { refreshTokenRouter } from './routes/refreshToken'

const app = express()
app.use("/refresh-token", refreshTokenRouter)

const server = new ApolloServer({ 
    typeDefs,
    resolvers,  
    context: ({ req, res }: { req: Request, res: Response }) => createContext({ req, res })
});

async function startServer() {
    await server.start();
    server.applyMiddleware({
        app,
        cors: {
            origin: [
                "https://studio.apollographql.com",
                "http://localhost:3000"
            ],
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