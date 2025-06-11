import {gql} from 'apollo-server'

export const authorSchema = gql`
  type Author {
    id: ID!
    name: String!
    nationality: String!    
  }
  
  type Query {
    getAllAuthors: [Author!]!
    findAuthor(id: ID!): Author
  }

  type Mutation {
    createAuthor(data: CreateAuthorInput!): AuthorMutationResponse!
    updateAuthor(id: ID!, data: EditAuthorInput!): AuthorMutationResponse!
    deleteAuthor(id: ID!): AuthorMutationResponse!
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
  type AuthorMutationResponse {
    id: ID
    success: Boolean!
    message: String!
  }
`