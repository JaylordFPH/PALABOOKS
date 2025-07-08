import { PrismaClient } from "@prisma/client";
import { CreateUserResponse, UsersWithRelationsDTO } from "../types/dto/user.dto";
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
    async createUser(data: {username: string, email: string, password: string, gender: "male" | "female", dob: string}): Promise<Response <CreateUserResponse | null>> {
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
                gender: gender as "male" | "female",
                dob: new Date(dob)
            }
        })

        const userDTO: CreateUserResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            gender: user.gender as "male" | "female",
            dob: user.dob
        }

        return response(true, "Successfully created a users.", userDTO)
    }

    async getAllUsers(): Promise<Response<UsersWithRelationsDTO[] | null>> {
        const users: UsersWithRelationsDTO[] = await this.prisma.user.findMany({select: {
            id: true,
            firstname: true,
            middlename: true,
            lastname: true,
            dob: true,
            gender: true,
            username: true,
            email: true,
            author: {
                select: {
                    stories: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            genre: true,
                            read_count: true,
                            created_at: true
                        }
                    },
                    created_at: true
                },
            },
            follower: {
                select: {
                    follower: {
                        select: {
                            id: true,
                            firstname: true,
                            middlename: true,
                            lastname: true,
                            dob: true,
                            gender: true,
                            username: true,
                            email: true,
                            created_at: true,
                        }
                    }
                }
            },
            following: {
                select: {
                    following: {
                        select: {
                            id: true,
                            firstname: true,
                            middlename: true,
                            lastname: true,
                            dob: true,
                            gender: true,
                            username: true,
                            email: true,
                            created_at: true,
                        }
                    }
                }
            },
            created_at: true
        }});

        return response(true, "Successfully retrieved users data.", users)
    }
}