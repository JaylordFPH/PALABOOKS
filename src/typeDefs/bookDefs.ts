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
    createBook(data: CreateBookInput!): BookMutationResponse!
    updateBook(id: ID!, data: UpdateBookInput!): BookMutationResponse!
    deleteBook(id: ID!): BookMutationResponse!
  }

  input CreateBookInput {
    title: String!
    genre: String!
    publishedYear: Int! 
    authorId: ID!
  }

  input UpdateBookInput {
    title: String
    genre: String
    publishedYear: Int
    authorId: ID
  }

  #Reponse
  type BookMutationResponse {
    id: ID!
    success: Boolean!
    message: String!
  }

`