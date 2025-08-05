import { GraphQLError } from "graphql"
import { GraphQLContext } from "../../../../lib/context"
import { checkToken } from "../../../../services/jwtUtils"

export const usersQueries = {
    Query: {
        getAllUsers: async (_: unknown, {pagination}: {pagination: {take: number, skip: number}}, context: GraphQLContext) => {
            try {
                checkToken(context.userId, context.tokenExpired);   
                const {take, skip} = pagination

                const {userService} = context.services
                const [res, count] = await Promise.all([ 
                    userService.getAllUsers(take, skip),
                    context.prisma.user.count() 
                ]);

                return {
                    success: res.success,
                    message: res.message,
                    data: {
                        user: res.data,
                        totalCount: count,
                        hasNextPage: take + skip < count ? true : false
                    }
                }
                
            } catch (error) {
                if (error instanceof GraphQLError) {
                    throw error
                }

                throw new GraphQLError("Unknown error occurred", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                    }
                })
            }
        }
    }
}
