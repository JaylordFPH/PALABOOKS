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

  type Mutation {
    createBook(data: CreateBookInput!): CreateBookResponse!
  }

  input CreateBookInput {
    title: String!
    genre: String!
    publishedYear: Int! 
    authorId: ID!
  }

  #Reponse
  type CreateBookResponse {
    id: ID!
    success: Boolean!
    message: String!
  }
`