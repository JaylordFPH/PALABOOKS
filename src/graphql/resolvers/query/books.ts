import { mockBooks } from "../../../mockData";
import { GraphQLError } from "graphql";
import { mockAuthors } from "../../../mockData";

type Book = {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
  authorId: string;
};

export const bookQuery = {
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
  Book: {
    author: (parent: Book) => {
        return mockAuthors.find(author => author.id === parent.authorId);
    }
  }
}