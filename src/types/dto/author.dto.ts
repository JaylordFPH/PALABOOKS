import { StoryMinimalDTO } from "./story.dto";

export type AuthorMinimalDTO = {
  stories: StoryMinimalDTO[]
  created_at: Date;
}