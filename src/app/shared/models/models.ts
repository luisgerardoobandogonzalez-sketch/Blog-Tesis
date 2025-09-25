import { BlogModels } from "./blog.model"; 
import { UserModels } from "./user.model";
import { CommentModels } from "./comment.model";

export namespace Models {
  export import Blog = BlogModels;
  export import User = UserModels;
  export import Comment = CommentModels;
 
}