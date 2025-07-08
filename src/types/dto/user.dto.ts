import { FollowingDTO, FollowerDTO } from "./follow.dto"
import { AuthorMinimalDTO } from "./author.dto"

export type CreateUserResponse = {
    id: string
    username: string,
    email: string,
    gender: "male" | "female" | null;
    dob: Date
}

export type UsersWithRelationsDTO = {
    id: string;
    firstname: string | null;
    middlename: string | null;
    lastname: string | null;
    gender: "male" | "female" | null;
    dob: Date;
    username: string;
    email: string;
    author?: AuthorMinimalDTO | null;
    following: FollowingDTO[];
    follower: FollowerDTO[];
    created_at: Date;
}

export type UserMinimalDTO = {
    id: string;
    firstname: string | null;
    middlename: string | null;
    lastname: string | null;
    gender: "male" | "female" | null;
    dob: Date;
    username: string;
    email: string;
    author?: AuthorMinimalDTO | null;
    created_at: Date;
}