import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs'; // Importa 'of' y 'tap'
import { Models } from 'src/app/shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();
    // --- NUEVO: Subject para manejar el rol del usuario ---
  private userRole = new BehaviorSubject<'admin' | 'user' | null>(null);
  public userRole$ = this.userRole.asObservable();

  constructor(private router: Router) {
    // Comprueba si ya existe un token al cargar la app
    this.checkToken();
  }

 private checkToken() {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role') as 'admin' | 'user' | null;
    if (token && role) {
      this.isAuthenticated.next(true);
      this.userRole.next(role);
    }
  }

  // --- MÉTODO ACTUALIZADO ---
  // Ahora acepta credenciales (aunque no las usaremos para la simulación)
login(credentials: { email: string, password: string }): Observable<boolean> {
    const isAdmin = credentials.email === 'admin@gmail.com' && credentials.password === '123456';
    const role = isAdmin ? 'admin' : 'user';

    // Simula la creación del token y el perfil
    const fakeToken = btoa(JSON.stringify({ email: credentials.email, role: role }));
    const fakeUserProfile = this.getFakeProfile(credentials.email, role);

    localStorage.setItem('auth_token', fakeToken);
    localStorage.setItem('user_profile', JSON.stringify(fakeUserProfile));
    localStorage.setItem('user_role', role); // Guardamos el rol

    this.isAuthenticated.next(true);
    this.userRole.next(role); // Notificamos el nuevo rol

    // Redirige según el rol
    const redirectPath = isAdmin ? '/admin' : '/profile';
    return of(true).pipe(tap(() => this.router.navigate([redirectPath])));
  }

   getUserProfile(): Models.User.User | null {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user_role'); // Limpia el rol
    this.isAuthenticated.next(false);
    this.userRole.next(null); // Resetea el rol
    this.router.navigate(['/home'], { replaceUrl: true });
  }

   private getFakeProfile(email: string, role: 'admin' | 'user'): Models.User.User {
  if (role === 'admin') {
    return {
      id: 'admin01',
      email,
      firstName: 'Admin',
      lastName: 'Principal',
      date_of_birth: '1990-01-01',
      career: 'Administración',
      role: 'admin',
      status: 'active', // <-- Añade esta línea
      created_at: new Date().toISOString(), // <-- Añade esta línea
    };
  }
  return {
    id: 'user123',
    email,
    firstName: 'Samantha',
    lastName: 'Jiménez',
    date_of_birth: '1998-05-15',
    career: 'Ingeniería de Sistemas',
    role: 'user',
    status: 'active', // <-- Añade esta línea
    created_at: new Date().toISOString(), // <-- Añade esta línea
  };
}

 
  
}