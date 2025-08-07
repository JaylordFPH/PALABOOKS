import {gql} from "graphql-tag";

export const followSchema = gql`
  type Follow {
    id: ID!
    followerId: ID!
    follower: User!
    followingId: ID!
    following: User!
    created_at: String!
  }

  type Query {
    getAllFollows: [Follow!]!
    findFollow(id: ID!): FollowOperationResponse!
  }

  type Mutation {
    createFollow(data: CreateFollowInput!): FollowOperationResponse!
    deleteFollow(id: ID!): FollowOperationResponse!
  }

  input CreateFollowInput {
    followerId: Int!
    followingId: Int!
  }

  type FollowOperationResponse {
    success: Boolean!
    message: String!
    data: Follow
  }
`