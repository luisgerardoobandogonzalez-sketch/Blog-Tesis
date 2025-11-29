import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./shared/components/blog-item/blog-item.component').then(m => m.BlogItemComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      { path: 'analytics', loadComponent: () => import('./admin/analytics/analytics.page').then(p => p.AnalyticsPage) },
      { path: 'users', loadComponent: () => import('./admin/users/users.page').then(p => p.UsersPage) },
      { path: 'blogs', loadComponent: () => import('./admin/manage-blogs/manage-blogs.page').then(p => p.ManageBlogsPage) },
      { path: 'reports', loadComponent: () => import('./admin/reports/reports.page').then(p => p.ReportsPage) },
    ]
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./pages/user-profile/user-profile.page').then(m => m.UserProfilePage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat-list/chat-list.page').then(m => m.ChatListPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat-room/chat-room.page').then(m => m.ChatRoomPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard.page').then(m => m.LeaderboardPage)
  },
  {
    path: 'tags',
    loadComponent: () => import('./pages/tags/tags.page').then(m => m.TagsPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];
