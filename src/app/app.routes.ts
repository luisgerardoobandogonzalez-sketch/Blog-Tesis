import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

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
    loadComponent: () => import('./shared/components/blog-item/blog-item.component').then( m => m.BlogItemComponent)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
