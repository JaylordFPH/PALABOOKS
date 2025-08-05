import {gql} from "apollo-server"

export const uploadSchema = gql`
  type Upload {
    id: ID!
    userId: ID!
    fileName: String!
    fileType: String!
    fileSize: Int!
    filePath: String!
    publicUrl: String!
    uploaded: Boolean!
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type Query {
    getAllUploaded: [Upload]!
  }

  type Mutation {
    helloWorld: String!
  }
`