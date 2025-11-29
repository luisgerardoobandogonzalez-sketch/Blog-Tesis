import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Models } from '../models/models';
import { delay, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notifications: Models.Notification.Notification[] = [];
    private notificationsSubject = new BehaviorSubject<Models.Notification.Notification[]>([]);

    // Observable para el conteo de no leídas
    unreadCount$ = this.notificationsSubject.pipe(
        map(notifications => notifications.filter(n => !n.is_read).length)
    );

    constructor() {
        this.loadNotifications();
    }

    private loadNotifications() {
        const stored = localStorage.getItem('user_notifications');
        if (stored) {
            this.notifications = JSON.parse(stored);
        } else {
            // Mock inicial
            this.notifications = [
                {
                    _id: 'notif_1',
                    recipient_id: 'current_user',
                    sender_id: 'user123',
                    type: 'like',
                    message: 'A Juan Pérez le gustó tu blog "Introducción a Ionic"',
                    data: { url: '/blog/63f8c2b7e0b5f6e8a1c9d4e1' },
                    is_read: false,
                    created_at: new Date(Date.now() - 3600000).toISOString() // Hace 1 hora
                },
                {
                    _id: 'notif_2',
                    recipient_id: 'current_user',
                    sender_id: 'system',
                    type: 'follow',
                    message: 'María García comenzó a seguirte',
                    data: { url: '/user/user789' },
                    is_read: true,
                    created_at: new Date(Date.now() - 86400000).toISOString() // Hace 1 día
                }
            ] as any; // Cast temporal por si los tipos no coinciden exacto con el modelo existente
            this.saveNotifications();
        }
        this.notificationsSubject.next(this.notifications);
    }

    private saveNotifications() {
        localStorage.setItem('user_notifications', JSON.stringify(this.notifications));
        this.notificationsSubject.next(this.notifications);
    }

    getNotifications(): Observable<Models.Notification.Notification[]> {
        // Ordenar por fecha descendente
        const sorted = [...this.notifications].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return of(sorted).pipe(delay(300));
    }

    getUnreadCount(): Observable<number> {
        return this.unreadCount$;
    }

    markAsRead(notificationId: string): Observable<boolean> {
        const notif = this.notifications.find(n => n._id === notificationId);
        if (notif) {
            notif.is_read = true;
            this.saveNotifications();
        }
        return of(true);
    }

    markAllAsRead(): Observable<boolean> {
        this.notifications.forEach(n => n.is_read = true);
        this.saveNotifications();
        return of(true);
    }

    createNotification(
        recipientId: string,
        senderId: string,
        type: 'like' | 'comment' | 'share' | 'follow' | 'mention' | 'level_up' | 'badge_earned',
        message: string,
        url: string
    ) {
        const newNotif: Models.Notification.Notification = {
            _id: `notif_${Date.now()}`,
            recipient_id: recipientId,
            sender_id: senderId,
            type: type as any, // Cast para admitir nuevos tipos si no actualicé el modelo aún
            message: message,
            data: { url },
            is_read: false,
            created_at: new Date().toISOString()
        };

        this.notifications.unshift(newNotif);
        this.saveNotifications();
        console.log('Notificación creada:', newNotif);
    }

    // Método helper para borrar notificaciones (útil para testing)
    clearAll() {
        this.notifications = [];
        this.saveNotifications();
    }
}
