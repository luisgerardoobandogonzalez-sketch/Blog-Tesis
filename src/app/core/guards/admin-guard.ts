import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.userRole$.pipe(
      take(1),
      map(role => {
        if (role === 'admin') {
          return true; // Acceso permitido
        } else {
          this.router.navigate(['/home']); // No es admin, redirige a home
          return false;
        }
      })
    );
  }
}