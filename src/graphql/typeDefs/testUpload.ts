import {gql} from 'graphql-tag'

export const testUpload = gql`
  type FileUpload {
    id: ID!
    url: String!
    filename: String!
    mimetype: String!
    createdAt: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    saveUploadedFile(url: String!, filename: String!, mimetype: String!): FileUpload!
  }
`