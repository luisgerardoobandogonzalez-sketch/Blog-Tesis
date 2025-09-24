import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs'; // Importa 'of' y 'tap'
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private router: Router) {
    // Comprueba si ya existe un token al cargar la app
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  // --- MÉTODO ACTUALIZADO ---
  // Ahora acepta credenciales (aunque no las usaremos para la simulación)
  login(credentials: { email: string, password: string }): Observable<boolean> {
    console.log('Simulando login para:', credentials.email);

    // 1. Crea un token JWT falso. En una app real, esto vendría del backend.
    // Un JWT simple tiene 3 partes separadas por puntos.
    const fakeHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const fakePayload = btoa(JSON.stringify({ userId: '123', email: credentials.email, exp: Math.floor(Date.now() / 1000) + 3600 }));
    const fakeSignature = 'fake-signature-for-testing'; // Esto no es seguro, solo para simulación
    const fakeToken = `${fakeHeader}.${fakePayload}.${fakeSignature}`;

    // 2. Guarda el token en el localStorage del navegador
    localStorage.setItem('auth_token', fakeToken);

    const fakeUserProfile = {
      firstName: 'Samantha',
      lastName: 'Jiménez',
      email: credentials.email,
      birthDate: '1998-05-15T00:00:00Z',
      profilePictureUrl: '/assets/images/avatar.png' // Una imagen de avatar de ejemplo
    };
    localStorage.setItem('user_profile', JSON.stringify(fakeUserProfile));

    // 3. Notifica a toda la app que el usuario está autenticado
    this.isAuthenticated.next(true);

    // 4. Devuelve un Observable que emite 'true' para simular una respuesta exitosa de la API
    return of(true).pipe(
      tap(() => this.router.navigate(['/profile'])) // Redirige al perfil después del login exitoso
    );
  }

   getUserProfile(): User | null {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    this.isAuthenticated.next(false);
    this.router.navigate(['/home'], { replaceUrl: true });
  }

 
  
}