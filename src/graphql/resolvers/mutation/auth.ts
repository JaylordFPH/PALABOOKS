import { GraphQLContext } from "../../../lib/context";
import { handleGraphQLError } from "../../../utils/formatGraphQLError";
import { getOrSet } from "../../../utils/redisUtils";
import { resilient } from "../../../utils/resilient";
import { getClientIp, createHashedClientSignature } from "../../../utils/securityUtils";
// import { checkToken } from "../../../services/jwtUtils";

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
  path: "/api/refresh-token", 
}

export const authMutation = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => { 
      const { email, password } = args.data;
      const ip = getClientIp(context.req!) as string
      const device_hash = createHashedClientSignature(context.req!)

      try {
       
        const loginService = context.services.authService.loginService
        const {success, message, accessToken, refreshToken} = await loginService(email, password, ip, device_hash);
        if(success && refreshToken) {
          context.res!.cookie("refreshToken", cookieOptions)
        }

        return {
          success,
          message,
          token: accessToken
        }
      } catch (err) {
        throw handleGraphQLError(err)
      }
    },

    // register: async (_: unknown, args: {data: {username: string, email: string, password: string, gender: "male" | "female", dob: string}}, context: GraphQLContext) => {
    //   const { username, email, password, gender, dob } = args.data;
    //   try {
    //     const {authService} = context.services;
    //     const result = await authService.signUp(username, email, password, gender, dob);

    //     if(result.success && result.refreshToken) {
    //       context.res?.cookie("refreshToken", result.refreshToken, cookieOptions);
    //     }

    //     return {
    //       success: result.success,
    //       message: result.message,
    //       token: result.accessToken
    //     }


    //   } catch (error) {
    //     throw formatGraphQLError(error);
    //   }

    // }

  }  
}