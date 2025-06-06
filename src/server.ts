import {ApolloServer} from 'apollo-server'
import { authorSchema } from './typeDefs/authorDefs'
import { bookSchema } from './typeDefs/bookDefs'
import { bookQuery } from './resolvers/query/books'
import {mergeTypeDefs} from '@graphql-tools/merge'

const typeDefs = mergeTypeDefs([
    authorSchema, 
    bookSchema
])

const resolvers = {
    Query: {
        ...bookQuery.Query,
    },
    Book: {
        ...bookQuery.Book
    }
}
    
const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({url}) => {
    console.log(`YOUR API IS RUNNING: ${url}`)
})
