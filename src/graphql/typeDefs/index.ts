import { mergeTypeDefs } from "@graphql-tools/merge";
import { authorSchema } from "./authorDefs";
import { storySchema } from "./storyDefs";
import { userSchema } from "./userDefs";
import { followSchema } from "./followDefs";
import { authSchema } from "./authDefs";
import { testUpload } from "./testUpload";
import { uploadSchema } from "./uploadDefs";

export const typeDefs = mergeTypeDefs([
    authSchema,
    authorSchema, 
    storySchema,
    userSchema,
    followSchema,
    testUpload,
    uploadSchema
    
]) 