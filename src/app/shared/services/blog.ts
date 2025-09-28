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
   private searchQuerySource = new Subject<string>();
  searchQuery$ = this.searchQuerySource.asObservable();
  private forbiddenWords: string[] = [
    'tonto', 'bobo', 'absurdo', 'inutil', 'estupido','puta' // Ejemplo, puedes añadir las que necesites
  ];
  
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
  },{
    _id: 'blog_pending_123',
  author_id: 'user789',
  title: 'Un Post Esperando Aprobación ',
  content: 'Este contenido necesita ser revisado por un administrador antes de ser público.',
  excerpt: 'Este contenido necesita ser revisado...',
  featured_image: '/assets/images/ionic-angular.png',
   tags: ['ionic', 'angular', 'desarrollo-movil'],
  career: 'Medicina',
  category: 'Investigación',
   reading_time: 5, 
    likes_count: 15,
    comments_count: 4,
    shares_count: 2,
    views_count: 152,
  is_published: false,
   is_featured: true, // <-- No está publicado
  moderation: { status: 'pending' },
  created_at: '2025-09-22T10:00:00Z',
    updated_at: '2025-09-22T12:30:00Z',
    published_at: '2025-09-22T10:00:00Z'
  }
];

  constructor() { }

 getBlogs(filters?: { career?: string, category?: string }): Observable<Models.Blog.Blog[]> {
  // 1. Filtra solo los blogs que están publicados Y aprobados
  let blogsToReturn = this.fakeBlogs.filter(
    blog => blog.is_published && blog.moderation.status === 'approved'
  );

  // 2. Aplica los filtros de categoría y carrera sobre la lista ya filtrada
  if (filters) {
    if (filters.career && filters.career !== 'all') {
      blogsToReturn = blogsToReturn.filter(blog => blog.career === filters.career);
    }
    if (filters.category && filters.category !== 'all') {
      blogsToReturn = blogsToReturn.filter(blog => blog.category === filters.category);
    }
  }
  
  return of(blogsToReturn).pipe(delay(500));
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

   const titleHasProfanity = this.containsProfanity(blogData.title!);
  const contentHasProfanity = this.containsProfanity(blogData.content!);

  let moderationStatus: 'pending' | 'approved' | 'rejected' = 'approved';
  let isPublished = true;
  let publishedDate: string | undefined = new Date().toISOString();

  if (titleHasProfanity || contentHasProfanity) {
    console.warn('Contenido marcado para moderación por filtro de palabras.');
    moderationStatus = 'pending';
    isPublished = false;
    publishedDate = undefined;
  }

  const newBlog: Models.Blog.Blog = {
    _id: `blog_${Date.now()}`,
    author_id: authorId,
    title: blogData.title!,
   content: blogData.content!,
    excerpt: blogData.content!.slice(0, 150) + '...',
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
    is_published: isPublished,
    is_featured: false, 
    meta_data: {
      
      seo_title: blogData.title!,
      seo_description: excerpt,
    },
    moderation: {
      
      status: moderationStatus,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: publishedDate,
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

 searchBlogs(query: string): Observable<Models.Blog.Blog[]> {
    if (!query || !query.trim()) {
      return this.getBlogs();
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredBlogs = this.fakeBlogs.filter(blog => {
      
      const titleMatch = blog.title.toLowerCase().includes(lowerCaseQuery);
      
      const contentMatch = blog.content.toLowerCase().includes(lowerCaseQuery);
      
      const tagsMatch = blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));

      return titleMatch || contentMatch || tagsMatch;
    });

    return of(filteredBlogs).pipe(delay(200)); 
  }

   performSearch(query: string) {
    this.searchQuerySource.next(query);
  }

    getAvailableCareers(): Observable<string[]> {
    const careers = [...new Set(this.fakeBlogs.map(blog => blog.career))];
    return of(careers);
  }

  getAvailableCategories(): Observable<string[]> {
    const categories = [...new Set(this.fakeBlogs.map(blog => blog.category))];
    return of(categories);
  }


  getAllBlogsForAdmin(): Observable<Models.Blog.Blog[]> {
  return of(this.fakeBlogs).pipe(delay(500));
}

updateBlogModeration(blogId: string, status: 'approved' | 'rejected'): Observable<Models.Blog.Blog> {
  const blog = this.fakeBlogs.find(b => b._id === blogId);
  if (blog) {
    blog.moderation.status = status;
    // Si se aprueba, se publica automáticamente
    if (status === 'approved') {
      blog.is_published = true;
      blog.published_at = new Date().toISOString();
    }
  }
  return of(blog!);
}

toggleFeaturedStatus(blogId: string): Observable<Models.Blog.Blog> {
  const blog = this.fakeBlogs.find(b => b._id === blogId);
  if (blog) {
    blog.is_featured = !blog.is_featured;
  }
  return of(blog!);
}

// Elimina un blog
deleteBlog(blogId: string): Observable<boolean> {
  this.fakeBlogs = this.fakeBlogs.filter(b => b._id !== blogId);
  this.blogAddedSource.next(); // Notifica que la lista cambió
  return of(true);
}

  private containsProfanity(text: string): boolean {
    const textToTest = text.toLowerCase();
    // La función 'some' se detiene en cuanto encuentra la primera coincidencia
    return this.forbiddenWords.some(word => {
      // Creamos una expresión regular para buscar la palabra completa, sin distinguir mayúsculas/minúsculas
      // \b significa "límite de palabra" (word boundary)
      const regex = new RegExp(`\\b${word}\\b`, 'i'); 
      return regex.test(textToTest);
    });
  }

}