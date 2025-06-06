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
    updateAuthor(id: ID!, data: EditAuthorInput!): Author
  }

  input EditAuthorInput {
    name: String
    nationality: String
  }
`