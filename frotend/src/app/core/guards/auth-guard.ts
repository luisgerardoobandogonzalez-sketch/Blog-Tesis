import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1), // Tomamos solo el primer valor para evitar suscripciones activas
      map(isAuth => {
        if (isAuth) {
          return true; // Si está autenticado, permite el acceso a la ruta
        } else {
          // Si no está autenticado, lo redirigimos a la página de inicio
          this.router.navigate(['/home']);
          return false; // Y bloqueamos el acceso
        }
      })
    );
  }
}
