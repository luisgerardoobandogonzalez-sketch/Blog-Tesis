import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { NotificationService } from 'src/app/shared/services/notification';
import { Models } from 'src/app/shared/models/models';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NotificationsPage implements OnInit {
  notifications: Models.Notification.Notification[] = [];
  isLoading = true;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getUserProfile();
    if (currentUser) {
      this.notificationService.getNotifications(currentUser.id).subscribe(data => {
        this.notifications = data;
        this.isLoading = false;
      });
    }
  }

  handleNotificationClick(notification: Models.Notification.Notification) {
    // 1. Marca la notificación como leída (en la simulación y en la UI)
    this.notificationService.markAsRead(notification._id).subscribe();
    notification.is_read = true;

    // 2. Navega a la URL asociada con la notificación
    this.router.navigateByUrl(notification.data.url);
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'follow': return 'person-add';
      default: return 'notifications';
    }
  }
}