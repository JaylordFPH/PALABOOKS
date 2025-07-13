import { authMutation } from "./mutation/auth"
import { usersMutation } from "./mutation/users"
import { usersQueries } from "./query/users"
import { testUploadQuery } from "./query/testUpload"
import { testUploadMutation } from "./mutation/testUpload"

export const resolvers =  {
    Query: {
        ...usersQueries.Query,
        ...testUploadQuery.Query
    },
    Mutation: {
        ...authMutation.Mutation,
        ...usersMutation.Mutation,
        ...testUploadMutation.Mutation
    },
}