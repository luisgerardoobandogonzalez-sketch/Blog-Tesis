import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Models } from 'src/app/shared/models/models';
import { map } from 'rxjs/operators';

// --- 1. DEFINE LA CLAVE COMO UNA CONSTANTE AQUÍ ---
const USER_PROFILE_KEY = 'user_profile';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_ROLE_KEY = 'user_role';
// ----------------------------------------------------

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();
  
  private userRole = new BehaviorSubject<'admin' | 'user' | null>(null);
  public userRole$ = this.userRole.asObservable();

   public isAdmin$: Observable<boolean>;
  public isUserOrGuest$: Observable<boolean>;

  constructor(private router: Router) {
 this.isAdmin$ = this.userRole$.pipe(map(role => role === 'admin'));
    this.isUserOrGuest$ = this.userRole$.pipe(map(role => role !== 'admin'));

    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY); // Usa la constante
    const role = localStorage.getItem(USER_ROLE_KEY) as 'admin' | 'user' | null; // Usa la constante
    if (token && role) {
      this.isAuthenticated.next(true);
      this.userRole.next(role);
    }
  }

  login(credentials: { email: string, password: string }): Observable<boolean> {
    const isAdmin = credentials.email === 'admin@gmail.com' && credentials.password === '123456';
    const role = isAdmin ? 'admin' : 'user';
    const fakeToken = btoa(JSON.stringify({ email: credentials.email, role: role }));
    const fakeUserProfile = this.getFakeProfile(credentials.email, role);

    // 2. USA LAS CONSTANTES PARA GUARDAR LOS DATOS
    localStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(fakeUserProfile));
    localStorage.setItem(USER_ROLE_KEY, role);

    this.isAuthenticated.next(true);
    this.userRole.next(role);

    const redirectPath = isAdmin ? '/admin' : '/profile';
    return of(true).pipe(tap(() => this.router.navigate([redirectPath])));
  }
  
  // 3. USA LA CONSTANTE PARA OBTENER LOS DATOS
  getUserProfile(): Models.User.User | null {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  logout() {
    // 4. USA LAS CONSTANTES PARA LIMPIAR TODO
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    this.isAuthenticated.next(false);
    this.userRole.next(null);
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