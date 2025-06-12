import { GraphQLError } from 'graphql';
import { mockAuthors } from '../../mockData'; // update the path as needed


export const authorMutation = {
  Mutation: {
    createAuthor: (_: unknown, args: {data: {name: string, nationality: string}}) => {
      try {
        const {name, nationality} = args.data;
        if(!name?.trim() || !nationality?.trim()){
          return {
            id: null,
            success: false,
            message: "Please fill in all required fields: name and nationality."
          }
        }

        const newAuthor = {
          id: String(mockAuthors.length + 1),
          name,
          nationality
        }
        mockAuthors.push(newAuthor);

        return {
          id: newAuthor.id,
          success: true,
          message: "Successfully created new author."
        }

      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              details: error.message,
            },
          });
        }

        // fallback if it's not an Error instance
        throw new GraphQLError("Unknown error occurred", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    updateAuthor: (_: unknown, args: {id: string, data: {name: string, nationality: string}}) => {
      try {
        const {id, data} = args
        const authorIndex = mockAuthors.findIndex((author) => String(author.id) === id)

        if(authorIndex === -1) {
          return {
            id: null,
            success: false,
            message: "Author not found"
          }
        }

        mockAuthors[authorIndex] = {
          ...mockAuthors[authorIndex],
          ...data
        }
        
        return {
          id: id,
          success: false,
          message: "Author not found"
        };

      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              details: error.message,
            },
          });
        }

        // fallback if it's not an Error instance
        throw new GraphQLError("Unknown error occurred", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },

    deleteAuthor: (_: unknown, args: {id: string}) => {
      try {
        const authorIndex = mockAuthors.findIndex(author => author.id === args.id);
        if(authorIndex === -1){
          return {
            id: null,
            success: false,
            message: "Author not found."
          }
        }
        const authorId = mockAuthors[authorIndex].id
        mockAuthors.splice(authorIndex, 1);

        return {
          id: authorId,
          success: true,
          message: "Successfully deleted an author"
        }

      } catch (error) {
        if (error instanceof Error) {
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              details: error.message,
            },
          });
        }

        // fallback if it's not an Error instance
        throw new GraphQLError("Unknown error occurred", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    }
  }
};
