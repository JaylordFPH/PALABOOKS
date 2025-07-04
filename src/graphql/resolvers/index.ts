import { authMutation } from "./mutation/auth"
import { usersMutation } from "./mutation/users"
import { usersQueries } from "./query/users"

export const resolvers =  {
    Query: {
        ...usersQueries.Query
    },
    Mutation: {
        ...authMutation.Mutation,
        ...usersMutation.Mutation
    },
}