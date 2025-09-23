import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject para mantener el estado de autenticación.
  // Inicia en 'false' (no autenticado).
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  // Observable público para que los componentes se suscriban.
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private router: Router) {
    // Podrías añadir lógica aquí para comprobar si ya existe un token en localStorage
    // y auto-loguear al usuario al recargar la página.
  }

  // Este método se llamaría después de una respuesta exitosa del backend
  login(token: string, userData: any) {
    // 1. Guardar el token (JWT) de forma segura (LocalStorage o preferiblemente Capacitor Secure Storage)
    localStorage.setItem('auth_token', token);

    // 2. Guardar datos del usuario si es necesario
    localStorage.setItem('user_data', JSON.stringify(userData));

    // 3. Notificar a toda la app que el usuario está autenticado
    this.isAuthenticated.next(true);

    // 4. (Opcional) Redirigir al usuario a una página de bienvenida o su perfil
    this.router.navigate(['/profile']);
  }

  logout() {
    // 1. Limpiar el almacenamiento local
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    // 2. Notificar a toda la app que el usuario ya no está autenticado
    this.isAuthenticated.next(false);

    // 3. Redirigir al usuario a la página de inicio.
    // El 'replaceUrl: true' es CRUCIAL. Evita que el usuario pueda usar
    // el botón "atrás" del navegador para volver a una ruta protegida.
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
