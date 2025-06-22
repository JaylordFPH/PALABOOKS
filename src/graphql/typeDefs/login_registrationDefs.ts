import { gql } from "apollo-server";

export const logAndReqSchema = gql`
    type Query {
        _query: String
    }

    type Mutation {
        login(data: LoginInput!): LoginOperationResponse!
    }

    type LoginOperationResponse {
        success: Boolean!
        message: String!
        token: String
    }

    input LoginInput {
        email: String
        password: String
    }
`

