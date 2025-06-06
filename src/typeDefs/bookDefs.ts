import {gql} from 'apollo-server'

export const bookSchema = gql`
  type Book {
    id: ID!
    title: String!
    genre: String!
    publishedYear: Int!
    authorId: ID!
    author: Author!
  }

  type Query {
    getAllBooks: [Book!]!
  }
`