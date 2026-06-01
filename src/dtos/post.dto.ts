export interface CreatePostDto {
  title: string;
  content: string;
}

export interface PostResponseDto {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}
