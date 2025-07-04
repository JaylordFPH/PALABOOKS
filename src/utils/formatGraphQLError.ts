import { GraphQLError } from "graphql";

export function formatGraphQLError(error: unknown): GraphQLError {
    if(error instanceof GraphQLError) {
        return error;
    }

    if(error instanceof Error) {
        return new GraphQLError(error.message, {
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
            }
        });
    }

    console.error("Unexpected error:", error);
    return new GraphQLError("An unexpected error occurred", {
        extensions: {
            code: "INTERNAL_SERVER_ERROR"
        }
    });
}