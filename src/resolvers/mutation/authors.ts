import { GraphQLError } from 'graphql';
import { mockAuthors } from '../../mockData'; // update the path as needed



export const authorMutation = {
  Mutation: {
    updateAuthor: (_: unknown, args: {id: string, data: {name: string, nationality: string}}) => {
      const {id, data} = args
      const authorIndex = mockAuthors.findIndex((author) => String(author.id) === id)

      if(authorIndex === -1) {
        throw new GraphQLError('Not found', {
          extensions: {
            code: "NOT_FOUND",
            http: {
              status: 404
            }
          }
        })
      }

      mockAuthors[authorIndex] = {
        ...mockAuthors[authorIndex],
        ...data
      }

      return mockAuthors[authorIndex];
    }
  }
};
