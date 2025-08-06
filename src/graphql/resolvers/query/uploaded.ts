import { GraphQLContext } from "../../../lib/context";

export const uploadedQuery = {
    Query: {
        getAllUploaded:  async (_: unknown, __: unknown, context: GraphQLContext) => {
            try {
                return await context.prisma.upload.findMany();
            } catch (err) {
                console.log(err) //for quick Test
            }
        }
    }
}