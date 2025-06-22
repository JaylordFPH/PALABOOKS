import {ApolloServer} from 'apollo-server'
import { authorSchema } from './graphql/typeDefs/authorDefs'
import { bookSchema } from './graphql/typeDefs/bookDefs'
import { bookQuery } from './graphql/resolvers/query/books'
import {mergeTypeDefs} from '@graphql-tools/merge'
import { bookMutation } from './graphql/resolvers/mutation/books'
import { authorMutation } from './graphql/resolvers/mutation/authors'
import { authorQuery } from './graphql/resolvers/query/authors'
import { createContext } from './lib/context'

const typeDefs = mergeTypeDefs([
    authorSchema, 
    bookSchema,
    
])

const resolvers = {
    Query: {
        // ...bookQuery.Query,
        ...authorQuery.Query
    },
    Mutation: {
        ...bookMutation.Mutation,
        ...authorMutation.Mutation
    },
    Book: {
        ...bookQuery.Book
    }
}
    
const server = new ApolloServer({
    typeDefs,
    resolvers,  
    context: createContext
})

server.listen().then(({url}) => {
    console.log(`Listening to ${url}`)
})
