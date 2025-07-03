import { GraphQLError } from "graphql"
import { GraphQLContext } from "../../../lib/context"
import { checkToken } from "../../../services/jwtUtils"
export const usersQueries = {
    Query: {
        getAllUsers: async (_: unknown, __: unknown, context: GraphQLContext) => {
            try {
                checkToken(context.userId, context.tokenExpired);
                
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
