import { gql } from "graphql-tag";

export const authSchema = gql`

    type Query {
        _query: String
    }

    type Mutation {
        login(data: LoginInput!): authOperationResponse!
        register(data: RegisterInput!): authOperationResponse!
    }

    type authOperationResponse {
        success: Boolean!
        message: String!
        token: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        gender: String!
        dob: String!
    }

    
`

