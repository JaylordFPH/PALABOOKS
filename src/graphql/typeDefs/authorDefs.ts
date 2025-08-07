import {gql} from 'graphql-tag'

export const authorSchema = gql`
  type Author {
    id: ID!
    userId: Int!
    user: User!
    stories: [Story!]
    created_at: String!
  }
  
  type Query {
    getAllAuthors: AuthorOperationResponse!
    findAuthor(id: ID!): AuthorOperationResponse!
  }

  type Mutation {
    createAuthor(data: CreateAuthorInput!): AuthorOperationResponse!
    updateAuthor(id: ID!, data: EditAuthorInput!): AuthorOperationResponse!
    deleteAuthor(id: ID!): AuthorOperationResponse!
  }

  input EditAuthorInput {
    name: String
    nationality: String
  }

  input CreateAuthorInput {
    name: String!
    nationality: String!
  }

  #Response
  type AuthorOperationResponse {
    success: Boolean!
    message: String!
    data: Author
  }

`