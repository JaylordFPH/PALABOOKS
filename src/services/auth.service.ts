import { PrismaClient } from "@prisma/client"
import { createAccessToken, createRefreshToken } from "./jwtUtils";
// import { UserService } from "./user.service";
import { isValidEmail } from "../utils/validators";
import { GraphQLError } from "graphql";
import { checkSWL, getUserLoginCache } from "../utils/redisUtils";
import { handleGraphQLError } from "../utils/formatGraphQLError";
import { redis } from "../lib/redisClient";

type AuthResponse = {
  success: boolean;
  message: string;
  accessToken: string 
  refreshToken: string 
}

function response(success: boolean, message: string, accessToken: string, refreshToken: string): AuthResponse {
    return {
      success,
      message,
      accessToken,
      refreshToken
    }
}

export class AuthService {
    constructor(private prisma: PrismaClient) {}
    async loginService (email: string, password: string, ip: string, device_hash: string ): Promise<AuthResponse> { 
      
      //Global SWL
      const GLOBAL_WINDOW = 60;
      const GLOBAL_HARD_LIMIT = 200;

      //SWL
      const SWL_IP_LIMIT = 50;
      const SWL_DEVICE_LIMIT = 10;
      const SWL_EMAIL_LIMIT = 5;
      const SWL_WINDOW = 60
    
      //keys
      const globalKey = `swl:login:global`
      const ipKey = `swl:login:ip:${ip}`;
      const dfKey = `swl:login:hashedDf:${device_hash}`
      const emailKey = `swl:login:email:${email}`
      const geolocationKey = `login:geo:ip:${ip}`

      //Risk level
      const RISK_NEW_IP = 1
      const RISK_NEW_COUNTRY = 5
      const RISK_NEW_REGION = 2
      const RISK_NEW_CITY = 2
      const RISK_NEW_DEVICE_HASH = 3;
      
      const RISK_LEVEL_NOTICE = 5
      const RISK_LEVEL_LOCK = 7
      let riskLevel = 0;

      try {

        const [isGlobalAllowed, isIpAllowed, isDfAllowed] = await Promise.all([
          checkSWL(globalKey, GLOBAL_HARD_LIMIT, GLOBAL_WINDOW),
          checkSWL(ipKey, SWL_IP_LIMIT, SWL_WINDOW),
          checkSWL(dfKey, SWL_DEVICE_LIMIT, SWL_WINDOW)
        ]);
        
        if(!isGlobalAllowed || !isIpAllowed || !isDfAllowed) throw new GraphQLError("Fix this later -allowed validation");
        
        if(!isValidEmail(email)) throw new GraphQLError("Fix this later - email validations");

        const [geolocation, user] = await Promise.all([
          (async () => {
            try {
              const geolocation = await redis.hGetAll(geolocationKey)

              if(Object.keys(geolocation).length > 0) {
                return {...geolocation}
              }

              const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`);
              const data = await res.json()
              return data;

            } catch (err){
              console.log("Failed to get geolocation by redis and ip-api. Error:", err)
              return null;
            }
          })(),
          getUserLoginCache(email, password, emailKey, geolocationKey, SWL_EMAIL_LIMIT, SWL_WINDOW)
        ]);

        console.log(`geolocation:`, geolocation)
        if (!user) throw new GraphQLError("Fix this later - user validations"); //improve this to handle redis maintenance

        if (user.ip !== ip) riskLevel += RISK_NEW_IP;
        if (user.country !== geolocation.country)  riskLevel += RISK_NEW_COUNTRY;
        if (user.region_name !== geolocation.regionName) riskLevel += RISK_NEW_REGION;
        if (user.city !== geolocation.city) riskLevel += RISK_NEW_CITY;
        if (user.device_hash !== device_hash) riskLevel += RISK_NEW_DEVICE_HASH;

        const token = createAccessToken({userId: user.id})
        const refreshToken = createRefreshToken({userId: user.id})

        if(riskLevel <= RISK_LEVEL_NOTICE) return response(true, "Unusual login detected", token, refreshToken)
        

        // if(riskLevel >= RISK_LEVEL_LOCK) {
          
        //   throw new GraphQLError("Fix this later - new login attempt at");
        // }

        return response(true, "login successfully.", token, refreshToken)

      } catch (error) {
        throw handleGraphQLError(error)
      }

        
    }

    // async signUp(username: string, email: string, password: string, gender: "male" | "female", dob: string): Promise<authResponse> {
    //     if (!username?.trim() || !email?.trim() || !password?.trim() || !gender?.trim() || !dob?.trim()) {
    //         return response(false, "Missing required fields. Please fill in all registration details.", null, null)
    //     }
        
    //     const existingUser = await this.prisma.user.findUnique({where: {email}});
    //     if(existingUser) {
    //         return response(false, "Email already exists.", null, null);
    //     }

    //     const userService = new UserService(this.prisma);
    //     const user = await userService.createUser({username, email, password, gender, dob});
    //     const payload = {
    //         userId: user.data!.id
    //     }

    //     return response(true, "User created successfully.", createAccessToken(payload), createRefreshToken(payload));
    // }
}