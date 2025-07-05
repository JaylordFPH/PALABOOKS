import { Gender, PrismaClient } from "@prisma/client";
import { UserDTO } from "../types/dto/user.dto";
import bcrypt from "bcrypt";

type Response <T extends object | null = null> = {
    success: boolean
    message: string
    data: T
}
function response<T extends object | null>(success: boolean, message: string, data: T): Response<T>{
    return {
        success,
        message,
        data
    }
}

export class UserService {
    constructor(private prisma: PrismaClient) {}

    //temporary types
    async createUser(data: {username: string, email: string, password: string, gender: Gender, dob: string}): Promise<Response <UserDTO | null>> {
        const {username, email, password, gender, dob} = data;
        if (!username?.trim() || !email?.trim() || !password?.trim() || !dob?.trim()) {
            return response(false, "Missing required fields. Please fill in all registration details.", null)
        }
        
        const existingUser = await this.prisma.user.findUnique({where: {email}});
        if(existingUser) {
            return response(false, "Email already exists.", null);
        }

        const hashedPassword =  await bcrypt.hash(data.password, 10)
        const user =  await this.prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword, 
                gender: gender as Gender,
                dob: new Date(dob)
            }
        })

        const userDTO: UserDTO = {
            username: user.username,
            email: user.email,
            gender: user.gender as Gender,
            dob: user.dob
        }

        return response(true, "Successfully retrieved users data.", userDTO)
    }

    //no RBAC for now and temporary types
    async getAllUsers(): Promise<Awaited<ReturnType<typeof this.prisma.user.findMany>>> {
        return this.prisma.user.findMany({include: {
            follower: {
                select: {
                    follower: true
                }
            },
            following: {
                select: {
                    following: true
                }
            },
            author: {
                select: {
                    stories: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            genre: true,
                            readCount: true,
                            created_at: true
                        }
                    }
                }
            }
        }})
    }
}