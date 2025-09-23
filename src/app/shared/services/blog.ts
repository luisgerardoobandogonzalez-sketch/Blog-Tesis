import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model'; // Necesitarás un modelo para tipar los datos

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // Cambia esta URL por la de tu API real
  private apiUrl = 'https://tu-api.com/blogs';

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<Blog[]> {
    // Hace una petición GET a la API para obtener todos los blogs
    return this.http.get<Blog[]>(this.apiUrl);
  }
}
