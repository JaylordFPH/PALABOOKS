import { GraphQLError } from 'graphql';
import { mockAuthors } from '../../mockData'; // update the path as needed



export const authorMutation = {
  Mutation: {
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
    }
  }
};
