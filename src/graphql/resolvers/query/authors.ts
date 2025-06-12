import { GraphQLError } from 'graphql';
import { mockAuthors } from '../../mockData'; // update the path as needed

export const authorQuery = {
  Query: {
    getAllAuthors: () => {
      try {
        if(mockAuthors.length < 1){
          return {
            success: false,
            message: "No authors found.",
            data: null,
          }
        }

        return {
          success: true,
          message: "Authors retrieved successfully.",
          data: mockAuthors,  
        };

      } catch (error) {
        if(error instanceof Error){
          throw new GraphQLError("Internal server error", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          })
        }

        //fallback
        throw new GraphQLError("Unknown error occured", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        })
      }
    },

    // findAuthor: (_: unknown, args: {id: string}) => {
    //   const {id} = args
    //   const author = mockAuthors.find((author) => String(author.id) === id);

    //   if(!author) throw new GraphQLError("No author found", {
    //     extensions: {
    //       code: "NOT_FOUND",
    //       http: {
    //         status: 404
    //       }
    //     }
    //   });

    //   return author;
    // }
  },


};
