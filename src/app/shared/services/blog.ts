import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Models } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  private blogAddedSource = new Subject<void>();
  blogAdded$ = this.blogAddedSource.asObservable();
  
  // Datos de prueba iniciales
private fakeBlogs: Models.Blog.Blog[] = [
  {
    _id: '63f8c2b7e0b5f6e8a1c9d4e1',
    author_id: 'user123', 
    title: 'Mi Aventura con Ionic y Angular',
    content: 'Contenido largo del blog sobre Ionic y Angular...',
    excerpt: 'Descubre cómo Ionic y Angular pueden transformar tu desarrollo de apps.',
    featured_image: '/assets/images/ionic-angular.png',
    tags: ['ionic', 'angular', 'desarrollo-movil'],
    career: 'Ingeniería de Sistemas',
    category: 'Tecnología',
    reading_time: 5, 
    likes_count: 15,
    comments_count: 4,
    shares_count: 2,
    views_count: 152,
    is_published: true,
    is_featured: true,
    moderation: { status: 'approved' },
    created_at: '2025-09-22T10:00:00Z',
    updated_at: '2025-09-22T12:30:00Z',
    published_at: '2025-09-22T10:00:00Z'
  },
 
];

  constructor() { }

  getBlogs(): Observable<Models.Blog.Blog[]> {
    return of(this.fakeBlogs).pipe(delay(500));
  }

  getBlogById(id: string): Observable<Models.Blog.Blog> {
    const blog = this.fakeBlogs.find(b => b._id === id);
    if (blog) {
      return of(blog).pipe(delay(300));
    } else {
      return throwError(() => new Error('Blog no encontrado'));
    }
  }

  // --- 1. NUEVO MÉTODO: Filtrar blogs por ID de autor ---
  getBlogsByAuthorId(authorId: string): Observable<Models.Blog.Blog[]> {
    const userBlogs = this.fakeBlogs.filter(b => b.author_id === authorId);
    return of(userBlogs).pipe(delay(200));
  }

  // --- 2. NUEVO MÉTODO: Crear un nuevo blog ---
createBlog(blogData: Partial<Models.Blog.Blog>, authorId: string): Observable<Models.Blog.Blog> {

  const excerpt = blogData.content!.slice(0, 150) + '...';

  
  const words = blogData.content!.split(' ').length;
  const reading_time = Math.ceil(words / 200);

  const newBlog: Models.Blog.Blog = {
    _id: `blog_${Date.now()}`,
    author_id: authorId,
    title: blogData.title!,
    content: blogData.content!,
    excerpt: excerpt, 
    featured_image: '/assets/icon/favicon.png', 
    images: [], 
    tags: blogData.tags || [],
    career: blogData.career!,
    category: blogData.category || 'General', 
    reading_time: reading_time, 
    likes_count: 0,
    comments_count: 0,
    shares_count: 0,
    views_count: 0, 
    is_published: true,
    is_featured: false, 
    meta_data: {
      
      seo_title: blogData.title!,
      seo_description: excerpt,
    },
    moderation: {
      
      status: 'approved',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  };

  
  this.fakeBlogs.unshift(newBlog);
  
  
  this.blogAddedSource.next();

  console.log('Nuevo blog creado con estructura completa:', newBlog);
  return of(newBlog).pipe(delay(100));
}


likeBlog(blogId: string): Observable<Models.Blog.Blog> {
  const blog = this.fakeBlogs.find(b => b._id === blogId);
  if (blog && !blog.currentUserHasLiked) {
    blog.likes_count++;
    blog.currentUserHasLiked = true;
  }
  return of(blog!);
}

unlikeBlog(blogId: string): Observable<Models.Blog.Blog> {
  const blog = this.fakeBlogs.find(b => b._id === blogId);
  if (blog && blog.currentUserHasLiked) {
    blog.likes_count--;
    blog.currentUserHasLiked = false;
  }
  return of(blog!);
}


updateBlog(blogId: string, updatedData: Partial<Models.Blog.Blog>): Observable<Models.Blog.Blog> {
  const blogIndex = this.fakeBlogs.findIndex(b => b._id === blogId);
  if (blogIndex > -1) {
    // Actualiza el blog en el array con los nuevos datos
    this.fakeBlogs[blogIndex] = { ...this.fakeBlogs[blogIndex], ...updatedData };
    console.log('Blog actualizado:', this.fakeBlogs[blogIndex]);
    return of(this.fakeBlogs[blogIndex]);
  }
  return throwError(() => new Error('No se pudo actualizar el blog'));
}
}