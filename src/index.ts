import {ApolloServer} from 'apollo-server'
import { typeDefs } from './schema/type-defs'
import { resolvers } from './schema/resolvers'

// const resolvers = {
//     ...UsersQuery.Query
// }

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({url}) => {
    console.log(`YOUR API IS RUNNING: ${url}`)
})
