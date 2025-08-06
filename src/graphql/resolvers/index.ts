import { authMutation } from "./mutation/auth"
import { usersMutation } from "./mutation/users"
// import { usersQueries } from "./query/users"
import { testUploadQuery } from "./query/testUpload"
// import { testUploadMutation } from "./mutation/testUpload"
// import { uploadedQuery } from "./query/uploaded"

export const resolvers =  {
    Query: {
        // ...usersQueries.Query,
        ...testUploadQuery.Query,
        // ...uploadedQuery.Query
    },
    Mutation: {
        ...authMutation.Mutation,
        ...usersMutation.Mutation,
        // ...testUploadMutation.Mutation
    },
}