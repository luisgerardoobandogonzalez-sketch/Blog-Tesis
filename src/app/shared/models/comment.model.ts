export namespace CommentModels{

export interface Comment {
  _id: string;
  blog_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  replies_count: number;
  
}

}