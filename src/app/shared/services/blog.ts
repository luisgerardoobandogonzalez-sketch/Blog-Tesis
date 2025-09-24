import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Blog } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // --- Usaremos un Subject para notificar a los componentes cuando se cree un nuevo blog ---
  private blogAddedSource = new Subject<void>();
  blogAdded$ = this.blogAddedSource.asObservable();
  
  // Datos de prueba iniciales
  private fakeBlogs: Blog[] = [ /* ... tus blogs de prueba existentes ... */ ];

  constructor() { }

  getBlogs(): Observable<Blog[]> {
    return of(this.fakeBlogs).pipe(delay(500));
  }

  getBlogById(id: string): Observable<Blog> {
    const blog = this.fakeBlogs.find(b => b._id === id);
    if (blog) {
      return of(blog).pipe(delay(300));
    } else {
      return throwError(() => new Error('Blog no encontrado'));
    }
  }

  // --- 1. NUEVO MÉTODO: Filtrar blogs por ID de autor ---
  getBlogsByAuthorId(authorId: string): Observable<Blog[]> {
    const userBlogs = this.fakeBlogs.filter(b => b.author_id === authorId);
    return of(userBlogs).pipe(delay(200));
  }

  // --- 2. NUEVO MÉTODO: Crear un nuevo blog ---
  createBlog(blogData: Partial<Blog>, authorId: string): Observable<Blog> {
    const newBlog: Blog = {
      _id: `blog_${Date.now()}`, // ID único falso
      author_id: authorId,
      title: blogData.title!,
      content: blogData.content!,
      images: [], // Por ahora vacío
      tags: blogData.tags || [],
      career: blogData.career!,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Añade el nuevo blog al principio de la lista
    this.fakeBlogs.unshift(newBlog);
    
    // Notifica a los suscriptores (como la HomePage) que se añadió un blog
    this.blogAddedSource.next();

    console.log('Nuevo blog creado:', newBlog);
    return of(newBlog).pipe(delay(100));
  }
}