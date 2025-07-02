import { GraphQLContext } from "../../../lib/context";
import { cookies} from "next/headers";
import { GraphQLError } from "graphql";

export const authMutaion = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => {
      const authService = context.services.authService;
      try {
        const result = await authService.login(args.data.email, args.data.password);

        if(result.success && result.refreshToken) {
          (await cookies()).set("refreshToken", result.refreshToken, {
            httpOnly: true, //anti XSS
            secure: true, //https
            sameSite: "strict", //anti CSRF
            maxAge: 60 * 60 * 24 * 7, //7 days
            path: "/refresh-token",
         });

        }

        return {
          success: false,
          message: result.message,
          token: result.accessToken
        }
        
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error
        }
        
        if(error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              error
            }
          });
        };

        throw new GraphQLError("An unexpected error occurred", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        });
      }
 
    }

  }  
}