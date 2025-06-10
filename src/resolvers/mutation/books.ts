import { GraphQLError } from "graphql";
import { mockAuthors, mockBooks } from "../../mockData";

const authorMap = new Map(mockAuthors.map(author => [author.id, author]));

export const bookMutation = {
    Mutation: {
        createBook: (_: unknown, args: {data: {title: string, genre: string, publishedYear: number, authorId: string}} ) => {
            const {title, genre, publishedYear, authorId} = args.data;

            if(!title?.trim() || !genre?.trim() || !publishedYear || !authorId?.trim()){
                throw new GraphQLError(`Invalid input.`, {
                    extensions: {
                        code: "BAD_REQUEST",
                            
                    }
                })
            }

            if(!authorMap.has(authorId)){
                throw new GraphQLError(`Author not found.`, {
                    extensions: {
                        code: "NOT_FOUND",
                        authorId
                    }
                })
            }

            const newBook = {
                id: String(mockBooks.length + 1),
                title, 
                genre,
                publishedYear,
                authorId
            }


            mockBooks.push(newBook)

            return {
                id: newBook.id,
                success: true,
                message: "Book created successfully"
            }
        }
    }
}