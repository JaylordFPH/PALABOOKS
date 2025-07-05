import { Gender } from "@prisma/client"

export type UserDTO = {
    username: string,
    email: string,
    gender: Gender,
    dob: Date
}

export type UserWithRelationDTO = {
    id: string;
    firstname: string;
    middlename: string;
    lastname: string;
    gender: string;
    dob: Date;
    username: string;
    email: "male" | "female";
    password: string;
    author?: Author | null;
    following: Follow[];
    follower: Follow[];
    created_at: Date;
}