import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Models } from '../models/models';
import { AuthService } from 'src/app/core/services/auth';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private commentAddedSource = new Subject<void>();
  commentAdded$ = this.commentAddedSource.asObservable();

  private fakeComments: Models.Comment.Comment[] = [
    {
      _id: 'c1',
      blog_id: '63f8c2b7e0b5f6e8a1c9d4e1',
      author_id: 'user456',
      content: '¡Gran artículo! Muy informativo.',
      likes_count: 5,
      replies_count: 1,
      is_edited: false, // <-- Campo añadido
      moderation: { status: 'approved' }, // <-- Campo añadido
      created_at: '2025-09-23T11:00:00Z', // <-- Campo añadido
      updated_at: '2025-09-23T11:00:00Z'  // <-- Campo añadido
    },
    {
      _id: 'c2',
      blog_id: '63f8c2b7e0b5f6e8a1c9d4e1',
      author_id: 'user789',
      content: 'Estoy de acuerdo, me ayudó a empezar mi proyecto.',
      likes_count: 2,
      replies_count: 0,
      is_edited: true, // <-- Campo añadido
      edited_at: '2025-09-23T15:30:00Z', // <-- Campo añadido
      moderation: { status: 'approved' }, // <-- Campo añadido
      created_at: '2025-09-23T14:00:00Z', // <-- Campo añadido
      updated_at: '2025-09-23T15:30:00Z'  // <-- Campo añadido
    },
    {
      _id: 'c3',
      blog_id: '63f8c2b7e0b5f6e8a1c9d4e1',
      author_id: 'user123',
      content: 'Gracias por sus comentarios :)',
      likes_count: 3,
      replies_count: 0,
      parent_comment_id: 'c1',
      is_edited: false, // <-- Campo añadido
      moderation: { status: 'approved' }, // <-- Campo añadido
      created_at: '2025-09-23T18:00:00Z', // <-- Campo añadido
      updated_at: '2025-09-23T18:00:00Z'  // <-- Campo añadido
    },
  ];

  constructor(private authService: AuthService) {}

  getComments(blogId: string): Observable<Models.Comment.Comment[]> {
    const comments = this.fakeComments.filter(c => c.blog_id === blogId);
    return of(comments).pipe(delay(400));
  }

  postComment(blogId: string, content: string, parentId?: string): Observable<Models.Comment.Comment> {
    const currentUser = this.authService.getUserProfile();
    const newComment: Models.Comment.Comment = {
       _id: `c${Date.now()}`,
    blog_id: blogId,
    author_id: currentUser!.id,
    content,
    parent_comment_id: parentId,
    likes_count: 0,
    replies_count: 0,
    is_edited: false, // <-- Propiedad añadida
    moderation: { status: 'approved' }, // <-- Propiedad añadida
    created_at: new Date().toISOString(), // <-- Propiedad añadida
    updated_at: new Date().toISOString()  // <-- Propiedad añadida
    };
    this.fakeComments.push(newComment);
    this.commentAddedSource.next();
    return of(newComment);
  }

deleteComment(commentId: string): Observable<boolean> {
  const initialLength = this.fakeComments.length;
  this.fakeComments = this.fakeComments.filter(c => c._id !== commentId);
  
  // Si la longitud cambió, la eliminación fue exitosa
  if (this.fakeComments.length < initialLength) {
    this.commentAddedSource.next(); // Reutilizamos el subject para notificar un cambio
    return of(true);
  }
  return of(false);
}

}