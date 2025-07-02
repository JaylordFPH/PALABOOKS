import { storyQueries } from "./query/books";

export const resolvers =  {
    Query: {
        ...storyQueries,
    },
    Mutation: {

    },
}