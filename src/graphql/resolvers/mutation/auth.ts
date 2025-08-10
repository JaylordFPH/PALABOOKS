import { GraphQLContext } from "../../../lib/context";
import { formatGraphQLError } from "../../../utils/formatGraphQLError";
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
  path: "/refresh-token", 
}

export const authMutation = {
  Mutation: {
    login: async (_: unknown, args: {data: {email: string, password: string}}, context: GraphQLContext) => { 
      const { email, password } = args.data;
      const user_id = "05844a17-cf20-4fbe-88ed-fa903f89f64f"
      const ip = getClientIp(context.req!)
      const hashedDP = createHashedClientSignature(context.req!)
      const { country, regionName, city } = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`).then( (data) =>  data.json())
      const lastLogin = await context.prisma.last_login.findUnique({where: {user_id}})
      const authService = context.services.authService;
      let riskScore = 0;

      try {
        if(!lastLogin?.last_ip) {
          const result = await authService.signIn(email, password);
          if(result.success && result.refreshToken) {
            context.res!.cookie("refreshToken", cookieOptions);
          }
          
          await context.prisma.last_login.create({
            data: {
              user_id,
              last_ip: ip! || "", 
              last_country: country || "", 
              last_region_name: regionName || "",
              last_city: city || "",
              last_device_hash: hashedDP
            }
          });

          return {  
            success: result.success,
            message: result.message,
            token: result.accessToken
          }
        }


        if(hashedDP !== lastLogin.last_device_hash) {
          riskScore += 3
        }

        if(ip !== lastLogin.last_ip) {
          riskScore += 2
        }

        if(lastLogin.last_city !== city){
          riskScore += 1
        }

        if(lastLogin.last_country !== country) {
          riskScore += 3
        }

        if(lastLogin.last_region_name !== regionName){
          riskScore += 2
        }

        if(riskScore >= 6) {
          throw new Error("Suspicious login detected. Verification required.");
        } else if (riskScore >= 3) {
          const result = await authService.signIn(email, password);
          if(result.success && result.refreshToken) {
            context.res!.cookie("refreshToken", cookieOptions);
          }

          await context.prisma.last_login.update({where: {user_id},
            data: {
              user_id,
              last_ip: ip! || "", 
              last_country: country || "", 
              last_region_name: regionName || "",
              last_city: city || "",
              last_device_hash: hashedDP
            }
          })

          return {
            success: result.success,
            message: `${result.message}. Unusual login detected.`,
            token: result.accessToken
          }
        } 

        const result = await authService.signIn(email, password);
        if(result.success && result.refreshToken) {
          context.res!.cookie("refreshToken", cookieOptions);
        }

        return {
          success: result.success,
          message: `${result.message}`,
          token: result.accessToken
        }
    
      } catch (error) {
        formatGraphQLError(error)
      }
    },

    register: async (_: unknown, args: {data: {username: string, email: string, password: string, gender: "male" | "female", dob: string}}, context: GraphQLContext) => {
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