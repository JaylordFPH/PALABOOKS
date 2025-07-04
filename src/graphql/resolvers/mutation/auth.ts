import { GraphQLContext } from "../../../lib/context";
import { formatGraphQLError } from "../../../utils/formatGraphQLError";

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
        const result = await authService.signIn(args.data.email, args.data.password);

        if(result.success && result.refreshToken) {
          console.log("Hit")
          context.res!.cookie("refreshToken", result.refreshToken, cookieOptions);
        }

        return {  
          success: result.success,
          message: result.message,
          token: result.accessToken
        }
        
      } catch (error) {
        throw formatGraphQLError(error);
      }
    },

    register: async (_: unknown, args: {data: {username: string, email: string, password: string, gender: string, dob: string}}, context: GraphQLContext) => {
      const { username, email, password, gender, dob } = args.data;
      try {
        const {authService} = context.services;
        const result = await authService.signUp(username, email, password, gender, dob);

        if(result.success && result.refreshToken) {
          context.res?.cookie("refreshToken", result.refreshToken, cookieOptions);
        }

        return {
          success: result.success,
          message: result.message,
          token: result.accessToken
        }


      } catch (error) {
        throw formatGraphQLError(error);
      }

    }

  }  
}