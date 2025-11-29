import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { NotificationService } from 'src/app/shared/services/notification.service';
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
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      this.isLoading = false;
    });
  }

  doRefresh(event: any) {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      event.target.complete();
    });
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.is_read = true);
    });
  }

  handleNotificationClick(notification: Models.Notification.Notification) {
    if (!notification.is_read) {
      this.notificationService.markAsRead(notification._id).subscribe();
      notification.is_read = true;
    }

    if (notification.data && notification.data.url) {
      this.router.navigateByUrl(notification.data.url);
    }
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'like': return 'heart';
      case 'comment': return 'chatbubble';
      case 'follow': return 'person-add';
      case 'level_up': return 'trending-up';
      case 'badge_earned': return 'ribbon';
      default: return 'notifications';
    }
  }

  getColorForType(type: string): string {
    switch (type) {
      case 'like': return 'danger';
      case 'comment': return 'primary';
      case 'follow': return 'success';
      case 'level_up': return 'warning';
      case 'badge_earned': return 'tertiary';
      default: return 'medium';
    }
  }
}