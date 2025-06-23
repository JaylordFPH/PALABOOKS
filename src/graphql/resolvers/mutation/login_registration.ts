import { GraphQLContext } from "../../../lib/context";
import { checkToken } from "../../../services/jwtUtils";
import { signToken } from "../../../services/jwtUtils";

export const logAndRegMutation = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => {
      const {email, password} = args.data
      checkToken(context.userId, context.tokenExpired);
      const user = await context.prisma.user.findUnique({where: {email}});

      if(!user) {
        return {
          success: false,
          message: "No user found",
          token: null
        }
      }

      if(user.password !== password){
        return {
          success: false,
          message: "Incorrect email or password",
          token: null
        }
      }

      signToken(user.id)

    }

  }  
}