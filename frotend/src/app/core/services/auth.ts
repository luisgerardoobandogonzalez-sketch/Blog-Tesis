import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Models } from 'src/app/shared/models/models';
import { map } from 'rxjs/operators';

// --- CONSTANTES DE LOCAL STORAGE ---
const USER_PROFILE_KEY = 'user_profile';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_ROLE_KEY = 'user_role';

// --- INTERFAZ PARA CREDENCIALES ---
export interface LoginCredentials {
  email: string;
  password: string;
}

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

  /**
   * Verifica si existe un token válido en localStorage al inicializar
   */
  private checkToken(): void {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const role = localStorage.getItem(USER_ROLE_KEY) as 'admin' | 'user' | null;
    if (token && role) {
      this.isAuthenticated.next(true);
      this.userRole.next(role);
    }
  }

  /**
   * Valida el formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Realiza el login del usuario
   * @param credentials - Email y contraseña del usuario
   * @returns Observable que indica si el login fue exitoso
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    // Validación de email
    if (!this.isValidEmail(credentials.email)) {
      console.error('Email inválido');
      return of(false);
    }

    // Validación de contraseña
    if (!credentials.password || credentials.password.length < 6) {
      console.error('La contraseña debe tener al menos 6 caracteres');
      return of(false);
    }

    // Determinación de rol basado en credenciales
    const isAdmin = credentials.email === 'admin@gmail.com' && credentials.password === '123456';
    const role = isAdmin ? 'admin' : 'user';

    // Generación de token fake (en producción, esto vendría del backend)
    const fakeToken = btoa(JSON.stringify({
      email: credentials.email,
      role: role,
      timestamp: Date.now()
    }));

    const fakeUserProfile = this.getFakeProfile(credentials.email, role);

    // Almacenamiento en localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(fakeUserProfile));
    localStorage.setItem(USER_ROLE_KEY, role);

    // Actualización de observables
    this.isAuthenticated.next(true);
    this.userRole.next(role);

    // Navegación según rol
    const redirectPath = isAdmin ? '/admin' : '/profile';
    return of(true).pipe(
      tap(() => {
        console.log(`Login exitoso como ${role}`);
        this.router.navigate([redirectPath]);
      })
    );
  }

  /**
   * Obtiene el perfil del usuario actual desde localStorage
   * @returns Perfil del usuario o null si no está autenticado
   */
  getUserProfile(): Models.User.User | null {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpieza de localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(USER_ROLE_KEY);

    // Actualización de observables
    this.isAuthenticated.next(false);
    this.userRole.next(null);

    console.log('Sesión cerrada');
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  /**
   * Genera un perfil fake para desarrollo (reemplazar con API real en producción)
   */
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
        status: 'active',
        created_at: new Date().toISOString(),
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
      status: 'active',
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Verifica si el usuario tiene rol de administrador
   */
  isAdminUser(): boolean {
    return this.userRole.value === 'admin';
  }

  /**
   * Obtiene el rol actual del usuario
   */
  getCurrentRole(): 'admin' | 'user' | null {
    return this.userRole.value;
  }
}