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

                if(error instanceof Error) {

                    //check if error is related to database connection
                    if(error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
                        try {
                            await context.prisma.$connect();
                            return await context.prisma.user.findMany();
                        } 
                        catch (reconnectError) {
                            if(reconnectError instanceof Error) {
                                throw new GraphQLError("Database connection error", {
                                    extensions: {
                                        code: "DATABASE_CONNECTION_ERROR"
                                    }
                                })
                            }
                        }
                    }

                    throw new GraphQLError("Internal server error", {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR"
                        }
                    })
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
