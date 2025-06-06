import { GraphQLError } from "graphql";

export const bookMutation = {
    Mutation: {
        createBook: (_: unknown, args: {data: {title: string, genre: string, publishedYear: number, authorId: string}} ) => {
            
        }
    }
}