import { UserMinimalDTO } from "./user.dto";


export type FollowingDTO = {
    following: UserMinimalDTO;
}

export type FollowerDTO = {
    follower: UserMinimalDTO;
}

