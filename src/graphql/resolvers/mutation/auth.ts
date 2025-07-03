import { GraphQLContext } from "../../../lib/context";
import { cookies} from "next/headers";
import { GraphQLError } from "graphql";
import { checkToken } from "../../../services/jwtUtils";

type cookieOptionsType = {
  httpOnly: boolean,
  secure: boolean,
  sameSite: boolean | "strict" | "lax" | "none" | undefined,
  maxAge: number,
  path: string
}

const cookieOptions: cookieOptionsType = {
  httpOnly: true, //anti XSS
  secure: true, //https
  sameSite: "strict", //anti CSRF
  maxAge: 60 * 60 * 24 * 7, //7 days
  path: "/refresh-token", 
}

export const authMutation = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => {
      const authService = context.services.authService;
      try {
        const result = await authService.login(args.data.email, args.data.password);

        if(result.success && result.refreshToken) {
          (await cookies()).set("refreshToken", result.refreshToken, cookieOptions);
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
            }
          });
        };

        throw new GraphQLError("An unexpected error occurred", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR"
          }
        });
      }
 
    },

    signUp: async (_: unknown, args: {data: {username: string, email: string, password: string, gender: string, dob: string}}, context: GraphQLContext) => {
      const { username, email, password, gender, dob } = args.data;
      try {
        checkToken(context.userId, context.tokenExpired);
        const {authService} = context.services;
        const result = await authService.signUp(username, email, password, gender, dob);

        if(result.success && result.refreshToken) {
          (await cookies()).set("refreshToken", result.refreshToken, cookieOptions);
        }

        return {
          success: result.success,
          message: result.message,
          token: result.accessToken
        }


      } catch (error) {
        if( error instanceof GraphQLError) {
          throw error; 
        }

        if(error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "INTERNAL_SERVER_ERROR"
            }
          })
        }
          
      }

    }

  }  
}