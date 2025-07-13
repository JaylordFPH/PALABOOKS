import {gql} from 'apollo-server'

export const testUpload = gql`
  scalar Upload
  type File {
    url: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    singleUpload(file: Upload!): File! 
  }
`