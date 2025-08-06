import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './graphql/resolvers'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './routes'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));


app.use("/api", router)
const server = new ApolloServer({ 
    typeDefs,
    resolvers,  
    context: ({ req, res }: { req: Request, res: Response }) => createContext({ req, res }),
    csrfPrevention: true
});

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1); // optional: fail fast
} else {
  console.log("✅ DATABASE_URL loaded:", process.env.DATABASE_URL);
}

async function startServer() {  
    await server.start();
    server.applyMiddleware({
        app,
        // cors: {
        //     origin: "*",
        //     credentials: true,
        //     methods: ['POST']
        // }
    });

    app.listen({ port: 4000,}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        console.log(`🚀 GraphQL Playground available at http://localhost:4000${server.graphqlPath}`);
    });
};

startServer();