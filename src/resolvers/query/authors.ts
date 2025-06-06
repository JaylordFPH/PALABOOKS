import { GraphQLError } from 'graphql';
import { mockAuthors } from '../../mockData'; // update the path as needed



export const authorQuery = {
  Query: {
    getAllAuthors: () => {
      return mockAuthors;
    },

    findAuthor: (_: unknown, args: {id: string}) => {
      const {id} = args
      const author = mockAuthors.find((author) => String(author.id) === id);

      if(!author) throw new GraphQLError("No author found", {
        extensions: {
          code: "NOT_FOUND",
          http: {
            status: 404
          }
        }
      });

      return author;
    }
  },


};
