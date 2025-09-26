import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Models } from 'src/app/shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

   // Simula una base de datos de usuarios
  private fakeUsers: Models.User.User[] = [
    { id: 'user123', email: 'samantha.j@email.com', firstName: 'Samantha', lastName: 'Jiménez', date_of_birth: '1998-05-15', career: 'Ingeniería de Sistemas', role: 'user', status: 'active', created_at: '2025-01-15T10:00:00Z', profile_picture_url: '/assets/icon/favicon.png' },
    { id: 'user456', email: 'carlos.perez@email.com', firstName: 'Carlos', lastName: 'Pérez', date_of_birth: '2000-11-20', career: 'Derecho', role: 'user', status: 'active', created_at: '2025-03-22T14:30:00Z', profile_picture_url: '/assets/icon/favicon.png' },
    { id: 'user789', email: 'laura.g@email.com', firstName: 'Laura', lastName: 'Gómez', date_of_birth: '1999-07-10', career: 'Medicina', role: 'user', status: 'suspended', created_at: '2025-05-30T09:15:00Z', profile_picture_url: '/assets/icon/favicon.png' },
    { id: 'admin01', email: 'admin@gmail.com', firstName: 'Admin', lastName: 'Principal', date_of_birth: '1990-01-01', career: 'Administración', role: 'admin', status: 'active', created_at: '2024-12-25T08:00:00Z', profile_picture_url: '/assets/icon/favicon.png' },
    { id: 'user101', email: 'juan.lopez@email.com', firstName: 'Juan', lastName: 'López', date_of_birth: '1997-02-25', career: 'Ingeniería de Sistemas', role: 'user', status: 'active', created_at: '2025-06-11T11:00:00Z', profile_picture_url: '/assets/icon/favicon.png' },
    { id: 'user102', email: 'maria.soto@email.com', firstName: 'Maria', lastName: 'Soto', date_of_birth: '2001-08-01', career: 'Derecho', role: 'user', status: 'active', created_at: '2025-07-19T16:45:00Z', profile_picture_url: '/assets/icon/favicon.png' },
 
  ];

   // Obtiene la lista de todos los usuarios
  getUsers(): Observable<Models.User.User[]> {
    return of(this.fakeUsers).pipe(delay(1000)); // Simula carga de red
  }

  // Simula la obtención de un resumen de datos de analítica
  getAnalyticsSummary(): Observable<any> {
    const summaryData = {
      totalUsers: 1250,
      newUsersToday: 15,
      totalBlogs: 430,
      blogsToday: 7,
      totalViews: 25800,
      topBlog: {
        title: 'Mi Aventura con Ionic y Angular',
        views: 152
      },
      recentActivity: [
        { type: 'Nuevo Usuario', user: 'carlos_perez', time: 'hace 5 min' },
        { type: 'Nuevo Blog', user: 'samantha_j', time: 'hace 12 min' },
        { type: 'Nuevo Comentario', user: 'laura_g', time: 'hace 28 min' },
      ]
    };
    return of(summaryData).pipe(delay(800)); // Simula una carga de red
  }

  getUserById(id: string): Observable<Models.User.User | undefined> {
  const user = this.fakeUsers.find(u => u.id === id);
  return of(user).pipe(delay(300));
}
}