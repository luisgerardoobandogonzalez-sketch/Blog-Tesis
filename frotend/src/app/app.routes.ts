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
    canActivate: [AuthGuard] // Protegemos la ruta de perfil
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthGuard] // Protegemos la ruta de configuración
  },
  {
    path: 'blog/:id', // ':id' es un parámetro que contendrá el ID del blog
    loadComponent: () => import('./shared/components/blog-item/blog-item.component').then(m => m.BlogItemComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [ // Los hijos ahora cuelgan directamente de /admin
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      { path: 'analytics', loadComponent: () => import('./admin/analytics/analytics.page').then(p => p.AnalyticsPage) },
      { path: 'users', loadComponent: () => import('./admin/users/users.page').then(p => p.UsersPage) },
      { path: 'blogs', loadComponent: () => import('./admin/manage-blogs/manage-blogs.page').then(p => p.ManageBlogsPage) },
      { path: 'reports', loadComponent: () => import('./admin/reports/reports.page').then(p => p.ReportsPage) },
    ]
  },
  {
    path: 'user/:id', // Perfil de un usuario específico por ID
    loadComponent: () => import('./pages/user-profile/user-profile.page').then(m => m.UserProfilePage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage),
    canActivate: [AuthGuard] // <-- Protegida, solo para usuarios logueados
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage),
    canActivate: [AuthGuard] // <-- Protegida, solo para usuarios logueados
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./pages/user-profile/user-profile.page').then(m => m.UserProfilePage)
  },

];
