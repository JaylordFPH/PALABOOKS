import { GraphQLError } from "graphql";
import { mockAuthors, mockBooks } from "../../mockData";

const authorMap = new Map(mockAuthors.map(author => [author.id, author]));



export const bookMutation = {
    Mutation: {
        createBook: (_: unknown, args: {data: {title: string, genre: string, publishedYear: number, authorId: string}} ) => {
            try{
                const {title, genre, publishedYear, authorId} = args.data;

                if(!title?.trim() || !genre?.trim() || !publishedYear || !authorId?.trim()){
                    return {
                        id: null,
                        success: false,
                        message: "Invalid input."
                    }
                }

                if(!authorMap.has(authorId)){
                    return {
                        id: null,
                        success: false,
                        message: "Not found."
                    }
                }

                const newBook = {
                    id: String(mockBooks.length + 1),
                    ...args.data
                }


                mockBooks.push(newBook)

                return {
                    id: newBook.id,
                    success: true,
                    message: "Book created successfully"
                }

            } catch (error: unknown){
                if(error instanceof Error){
                    throw new GraphQLError("Internal server error", {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR"
                        }
                    });
                }

                throw new GraphQLError("Unknown error occured.", {
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR"
                    }
                });

            }
        },

        updateBook: (_: unknown, args: {id: string, data: {title: string, genre: string, publishedYear: number, authorId: string}}) => {


            try {
                const bookIndex = mockBooks.findIndex(book => book.id === args.id);

                if(bookIndex === -1) {
                    return {
                        id: null,
                        success: false,
                        message: "Book not found."
                    }
                }


                mockBooks[bookIndex] = {
                    ...mockBooks[bookIndex],
                    ...args.data
                }
                console.log(mockBooks[bookIndex])

                
                return {
                    id: args.id,
                    success: true,
                    message: "Book created successfully",
                }
            } catch (error){
                if (error instanceof Error){
                    throw new GraphQLError("Internal server error", {
                        extensions: {
                            code: "INTERNAL_SERVER_ERROR"
                        }
                    })
                }
            }
        },

        deleteBook: (_: unknown, args: {id: string}) => {
            const bookIndex = mockBooks.findIndex(book => book.id === args.id);
            if(bookIndex === -1){
                
            }
        }
    },

}