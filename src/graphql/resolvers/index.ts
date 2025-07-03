import { authMutation } from "./mutation/auth"

export const resolvers =  {
    Query: {
        
    },
    Mutation: {
        ...authMutation.Mutation,
    },
}