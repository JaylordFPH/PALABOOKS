import {gql} from 'apollo-server'

export const userSchema = gql`

  enum Gender {
    male
    female
  }

  type User {
    id: ID!
    firstname: String
    middlename: String
    lastname: String
    gender: Gender!
    dob: String!
    username: String!
    email: String!
    password: String!
    author: Author
    following: [Follow!]
    follower: [Follow!]
    created_at: String!
  }

  type Query {
    getAllUsers(pagination: OffsetPaginationInput!): UserOperationResponse!
    findUser(id: ID!): UserOperationResponse!
  }

  type Mutation {
    createUser(data: CreateUserInput!): UserOperationResponse!
    updateUser(id: ID!, data: UpdateUserInput!): UserOperationResponse!
    deleteUser(id: ID!): UserOperationResponse!
  }

  type UserOperationResponse {
    success: Boolean!
    message: String!
    data: UserPaginationResponse
  }

  type UserPaginationResponse {
    user: [User!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input OffsetPaginationInput {
    take: Int!
    skip: Int!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    gender: String!
    dob: String!
  }

  input UpdateUserInput {
    firstname: String
    middlename: String
    lastname: String
    gender: String
    dob: String
    username: String
    email: String
    password: String
  }
`