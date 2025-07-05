import { User } from "@prisma/client";

export type AuthorDTO = {
  id: number;
  userId: string;
  user?: User;
  stories: Story[];
  created_at: Date;
};

export type StoryDTO = {
    
}