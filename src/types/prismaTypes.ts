// types/prismaTypes.ts

export type User = {
  id: string;
  firstname?: string | null;
  middlename?: string | null;
  lastname?: string | null;
  gender: string;
  dob: Date;
  username: string;
  email: "male" | "female";
  password: string;
  author?: Author | null;
  following: Follow[];
  follower: Follow[];
  created_at: Date;
};

export type Author = {
  id: number;
  userId: string;
  user: User;
  stories: Story[];
  created_at: Date;
};

export type Story = {
  id: number;
  title: string;
  genre: string;
  description: string;
  content: string;
  readCount: number;
  authorId: number;
  author: Author;
  created_at: Date;
};

export type Follow = {
  id: number;
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
};
