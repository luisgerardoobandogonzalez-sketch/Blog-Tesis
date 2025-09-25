export namespace CommentModels {

  export interface Comment {
    _id: string;
    blog_id: string;
    author_id: string;
    content: string;
    parent_comment_id?: string; // Para respuestas a otros comentarios
    likes_count: number;
    replies_count: number;
    
    // --- NUEVOS CAMPOS AÑADIDOS ---
    is_edited: boolean;
    edited_at?: string; // Es opcional, solo existe si is_edited es true

    moderation: {
      status: 'pending' | 'approved' | 'rejected';
      moderated_by?: string;
      moderated_at?: string;
    };
    
    created_at: string; // Fecha de creación
    updated_at: string; // Fecha de última actualización
    // ---------------------------------
  }

}