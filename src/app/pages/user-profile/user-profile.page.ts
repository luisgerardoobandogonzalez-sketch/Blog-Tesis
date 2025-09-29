import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from 'src/app/admin/services/admin';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { UserService } from 'src/app/shared/services/user'; 
import { AuthService } from 'src/app/core/services/auth';
import { StarRatingComponent } from 'src/app/shared/components/star-rating/star-rating.component';
import { Observable } from 'rxjs'; // Importa Observable

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,RouterLink,StarRatingComponent]
})
export class UserProfilePage implements OnInit {
  userProfile: Models.User.User | null | undefined = null;
  userBlogs: Models.Blog.Blog[] = [];
  isLoading = true;
  followerCount = 0;
  followingCount = 0;
  isFollowing = false;
  isCurrentUserProfile = false;
   userRating = { average: 0, count: 0 };
   isAuthenticated$: Observable<boolean>;
  currentUserRating:number = 0;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private blogService: BlogService,
    private userService: UserService, // Inyéctalo
    private authService: AuthService
  ) {    this.isAuthenticated$ = this.authService.isAuthenticated$; }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Obtenemos los datos del perfil
      this.adminService.getUserById(userId).subscribe(user => {
        this.userProfile = user;

        // Obtenemos los blogs de ese usuario
        this.blogService.getBlogsByAuthorId(userId).subscribe(blogs => {
          this.userBlogs = blogs;
          this.isLoading = false;

          
        });
      });
       this.userService.getRatingForUser(userId).subscribe(rating => {
        this.userRating = rating;
      });
    }
  }

 loadProfileData(userId: string) {
    this.isLoading = true;
    // Carga de datos del perfil
    this.adminService.getUserById(userId).subscribe(user => {
      this.userProfile = user;
      // Carga de blogs
      this.blogService.getBlogsByAuthorId(userId).subscribe(blogs => {
        this.userBlogs = blogs;
      });
      // Carga de contadores y estado de seguimiento
      this.userService.getFollowerCount(userId).subscribe(count => this.followerCount = count);
      this.userService.getFollowingCount(userId).subscribe(count => this.followingCount = count);
      this.userService.isFollowing(userId).subscribe(status => this.isFollowing = status);
      
      this.isLoading = false;

      console.log('seguidores:', this.followerCount);
    });
  }

  // --- NUEVA FUNCIÓN PARA EL BOTÓN ---
  toggleFollow() {
    if (!this.userProfile) return;

    const action$ = this.isFollowing 
      ? this.userService.unfollowUser(this.userProfile.id)
      : this.userService.followUser(this.userProfile.id);

    action$.subscribe(() => {
      // Actualiza el estado y contadores localmente para una respuesta instantánea en la UI
      this.isFollowing = !this.isFollowing;
      if (this.isFollowing) {
        this.followerCount++;
      } else {
        this.followerCount--;
      }
    });
  }

rateThisUser(rating: number) {
    if (this.userProfile) {
      this.currentUserRating = rating;
      
      // Le decimos a TypeScript que confíe en que el número es del 1 al 5
      const ratingValue = rating as 1 | 2 | 3 | 4 | 5;
      
      this.userService.rateUser(this.userProfile.id, ratingValue)
        .subscribe(() => {
          console.log(`Has calificado a ${this.userProfile?.firstName} con ${rating} estrellas.`);
          // Aquí se recargaría el promedio en una app real
        });
    }
  }


}