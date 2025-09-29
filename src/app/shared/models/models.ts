import { BlogModels } from "./blog.model"; 
import { UserModels } from "./user.model";
import { CommentModels } from "./comment.model";
import { NotificationModels } from "./notificantions.model";
import { ReportModel } from "./repor.model";
import { RatingModels } from "./rating.models";
export namespace Models {
  export import Blog = BlogModels;
  export import User = UserModels;
  export import Comment = CommentModels;
  export import Notification = NotificationModels;
 export import Report = ReportModel;
 export import Rating = RatingModels;
}