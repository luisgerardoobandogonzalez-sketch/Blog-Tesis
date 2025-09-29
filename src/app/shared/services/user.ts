import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth';
import { Models } from '../models/models';

interface Follow {
  follower_id: string; // El que sigue
  following_id: string; // El seguido
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Notifica a los componentes cuando el estado de seguimiento cambia
  private followStatusChanged = new Subject<void>();
  followStatusChanged$ = this.followStatusChanged.asObservable();

  // Simula la tabla 'follows' de la base de datos
  private fakeFollows: Follow[] = [
    { follower_id: 'user123', following_id: 'user456' }, // Samantha sigue a Carlos
    { follower_id: 'user789', following_id: 'user123' }, // Laura sigue a Samantha
    { follower_id: 'user456', following_id: 'user123' }, // Carlos sigue a Laura
  ];

    private fakeRatings: Models.Rating.Rating[] = [
    // Calificaciones para Carlos Pérez (user456)
    { _id: 'r1', rated_user_id: 'user456', rater_user_id: 'user123', rating_value: 5, created_at: '' },
    { _id: 'r2', rated_user_id: 'user456', rater_user_id: 'user789', rating_value: 4, created_at: '' },
    { _id: 'r3', rated_user_id: 'user456', rater_user_id: 'user101', rating_value: 4, created_at: '' },
  ];

  constructor(private authService: AuthService) { }

  // Comprueba si el usuario actual está siguiendo a otro usuario
  isFollowing(userIdToCheck: string): Observable<boolean> {
    const currentUser = this.authService.getUserProfile();
    if (!currentUser) return of(false);

    const isFollowing = this.fakeFollows.some(
      f => f.follower_id === currentUser.id && f.following_id === userIdToCheck
    );
    return of(isFollowing);
  }

  // Seguir a un usuario
  followUser(userIdToFollow: string): Observable<boolean> {
    const currentUser = this.authService.getUserProfile();
    if (!currentUser) return of(false);

    // Evita duplicados
    if (!this.fakeFollows.some(f => f.follower_id === currentUser.id && f.following_id === userIdToFollow)) {
      this.fakeFollows.push({ follower_id: currentUser.id, following_id: userIdToFollow });
      console.log('Follows:', this.fakeFollows);
      this.followStatusChanged.next(); // Notifica el cambio
    }
    return of(true);
  }

  // Dejar de seguir a un usuario
  unfollowUser(userIdToUnfollow: string): Observable<boolean> {
    const currentUser = this.authService.getUserProfile();
    if (!currentUser) return of(false);
    
    this.fakeFollows = this.fakeFollows.filter(
      f => !(f.follower_id === currentUser.id && f.following_id === userIdToUnfollow)
    );
    console.log('Follows:', this.fakeFollows);
    this.followStatusChanged.next(); // Notifica el cambio
    return of(true);
  }

  // Obtener contadores
  getFollowerCount(userId: string): Observable<number> {
    const count = this.fakeFollows.filter(f => f.following_id === userId).length;
    return of(count);
  }
  
  getFollowingCount(userId: string): Observable<number> {
    const count = this.fakeFollows.filter(f => f.follower_id === userId).length;
    return of(count);
  }

 getRatingForUser(userId: string): Observable<{ average: number, count: number }> {
    const ratingsForUser = this.fakeRatings.filter(r => r.rated_user_id === userId);
    if (ratingsForUser.length === 0) {
      return of({ average: 0, count: 0 });
    }
    const sum = ratingsForUser.reduce((acc, r) => acc + r.rating_value, 0);
    const average = sum / ratingsForUser.length;
    return of({ average: average, count: ratingsForUser.length });
  }

  rateUser(ratedUserId: string, ratingValue: 1 | 2 | 3 | 4 | 5): Observable<boolean> {
    const currentUser = this.authService.getUserProfile();
    if (!currentUser) return of(false);
    
    // Simula añadir o actualizar una calificación
    console.log(`Usuario ${currentUser.id} ha calificado a ${ratedUserId} con ${ratingValue} estrellas.`);
    this.fakeRatings.push({ _id: `r${Date.now()}`, rated_user_id: ratedUserId, rater_user_id: currentUser.id, rating_value: ratingValue, created_at: '' });
    
    return of(true);
  }


}