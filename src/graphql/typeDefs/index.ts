import { mergeTypeDefs } from "@graphql-tools/merge";
import { authorSchema } from "./authorDefs";
import { storySchema } from "./storyDefs";

export const typeDefs = mergeTypeDefs([
    authorSchema, 
    storySchema
]) 