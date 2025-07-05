import {gql} from 'apollo-server'

export const storySchema = gql`
  type Story {
    id: ID!
    title: String!
    description: String!
    content: String!
    genre: String!
    authorId: ID!
    author: Author!
    created_at: String!
  }

  type Query {
    getAllStory: [Story!]!
  }

  type Mutation {
    createStory(data: CreateStoryInput!): StoryOperationResponse!
    updateStory(id: ID!, data: UpdateStoryInput!): StoryOperationResponse!
    deleteStory(id: ID!): StoryOperationResponse!
  }

  input CreateStoryInput {
    title: String!
    genre: String!
    publishedYear: Int! 
    authorId: ID!
  }

  input UpdateStoryInput {
    title: String
    genre: String
    publishedYear: Int
    authorId: ID
  }

  #Reponse
  type StoryOperationResponse {
    success: Boolean!
    message: String!
    data: Story
  }

`