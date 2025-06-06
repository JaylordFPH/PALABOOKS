import { MockUsers } from '../mockData'; // update the path as needed

export const resolvers = {
  Query: {
    getUsers: () => {
      return MockUsers;
    },
  },
};
