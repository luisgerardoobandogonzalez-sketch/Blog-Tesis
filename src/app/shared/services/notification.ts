import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Models } from '../models/models'; // Crearemos este modelo a continuación

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private fakeNotifications: Models.Notification.Notification[] = [
    {
      _id: 'notif1',
      recipient_id: 'user123',
      sender_id: 'user456',
      type: 'like',
      message: 'A Carlos Pérez le ha gustado tu publicación: "¿Por Qué Elegir una Base de Datos NoSQL?".',
      data: { url: '/blog/63f8c2b7e0b5f6e8a1c9d4e2' },
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() // Hace 5 minutos
    },
    {
      _id: 'notif2',
      recipient_id: 'user123',
      sender_id: 'user789',
      type: 'comment',
      message: 'Laura Gómez ha comentado en tu publicación: "Mi Aventura con Ionic y Angular".',
      data: { url: '/blog/63f8c2b7e0b5f6e8a1c9d4e1' },
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // Hace 30 minutos
    },
    {
      _id: 'notif3',
      recipient_id: 'user123',
      sender_id: 'user789',
      type: 'follow',
      message: 'Laura Gómez ha comenzado a seguirte.',
      data: { url: '/user/user789' },
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // Hace 2 horas
    },
  ];

  constructor() { }

  // Obtiene las notificaciones para un usuario específico
  getNotifications(userId: string): Observable<Models.Notification.Notification[]> {
    const userNotifications = this.fakeNotifications.filter(n => n.recipient_id === userId);
    return of(userNotifications).pipe(delay(600)); // Simula carga de red
  }

  // Simula marcar una notificación como leída
  markAsRead(notificationId: string): Observable<boolean> {
    const notification = this.fakeNotifications.find(n => n._id === notificationId);
    if (notification) {
      notification.is_read = true;
    }
    return of(true);
  }
}