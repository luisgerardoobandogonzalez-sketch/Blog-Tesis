export namespace BlogModels{

export interface Blog {
  _id: string;
  author_id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  images?: string[];
  tags?: string[];
  career: string;
  category: string;
  reading_time?: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_published: boolean;
  is_featured: boolean;
  currentUserHasLiked?: boolean;
  meta_data?: {
    seo_title?: string;
    seo_description?: string;
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    moderated_by?: string;
    rejection_reason?: string;
  };
  created_at: string;
  updated_at: string;
  published_at?: string;
}


}