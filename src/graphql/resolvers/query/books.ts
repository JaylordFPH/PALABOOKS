import { mockBooks } from "../../../mockData";
import { GraphQLError } from "graphql";
import { mockAuthors } from "../../../mockData";

export const storyQueries = {
  Query: {
    getAllBooks: () => {
      if (!mockBooks || mockBooks.length === 0) {
          throw new GraphQLError("No books found", {
              extensions: {
                  code: "NOT_FOUND",  
              }
          });
      }

      

      return mockBooks;
    }
  },
}