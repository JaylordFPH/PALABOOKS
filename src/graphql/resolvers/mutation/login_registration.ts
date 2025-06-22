import { GraphQLContext } from "../../../lib/context";
import { checkToken } from "../../../services/jwtUtils";

export const logAndRegMutation = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => {
      const {email, password} = args.data
      checkToken(_, context.tokenExpired)
    },
  }  
}