import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../../lib/context";
import { checkToken } from "../../../services/jwtUtils";

export const usersMutation = {
    Mutation: {
        createUser: async (_: unknown, args: {data: {username: string, email: string, password: string, gender: "male" | "female", dob: string}}, context: GraphQLContext) => {
            const data = {
                username: args.data.username,
                email: args.data.email,
                password: args.data.password,
                gender: args.data.gender,
                dob: args.data.dob
            };

            try {
                const {userService} = context.services
                checkToken(context.userId, context.tokenExpired);
                const user = await userService.createUser(data)
                return {
                    success: true,
                    message: "User created successfully.",
                    data: user
                };

            } catch (error) {
                if(error instanceof GraphQLError) {
                    throw error;
                }

                if(error instanceof Error) {
                    throw new GraphQLError(error.name, {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR"
                        }
                    });
                }

                throw new GraphQLError("An unexpected error occurred", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                    }
                });
            }
            
        }
    }
}