import {ApolloServer} from 'apollo-server'
import { typeDefs } from './graphql/typeDefs'
import { createContext } from './lib/context'
import { resolvers } from './graphql/resolvers'

    
const server = new ApolloServer({
    typeDefs,
    resolvers,  
    context: createContext
})

server.listen().then(({url}) => {
    console.log(`Listening to ${url}`)
})
