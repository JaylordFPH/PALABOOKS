import { GraphQLContext } from "../../../../lib/context";


export const testUploadMutation = {
    Mutation: {
        saveUploadedFile: async (_: unknown, args: { url: string, filename: string, mimetype: string }, context: GraphQLContext) => {
            const {url, filename, mimetype} = args
            const file = await context.prisma.fileUpload.create({
                data: {
                    url,
                    filename,
                    mimetype,
                },
            });
            return file;
        },
        
    } 
}