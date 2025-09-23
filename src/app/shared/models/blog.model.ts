export interface Blog {
  // Propiedades que vienen del backend
  _id: string;
  author_id: string; // Podrías expandirlo a un objeto UserProfile más adelante
  title: string;
  content: string;
  images: string[];
  tags: string[];
  career: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  created_at: string; // Usar string es más seguro para las fechas que vienen de una API (formato ISO)
  updated_at: string;
}
