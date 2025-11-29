import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { AdminService } from 'src/app/admin/services/admin';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { UserService } from 'src/app/shared/services/user';
import { AuthService } from 'src/app/core/services/auth';
import { GamificationService } from 'src/app/shared/services/gamification';
import { StarRatingComponent } from 'src/app/shared/components/star-rating/star-rating.component';
import { ProfileEditModalComponent } from 'src/app/shared/components/profile-edit-modal/profile-edit-modal.component';
import { ChatService } from 'src/app/shared/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, StarRatingComponent]
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
  currentUserRating: number = 0;

  // Estadísticas de rendimiento
  totalLikesReceived = 0;
  totalCommentsReceived = 0;

  // Gamification Data
  userXP: Models.Gamification.UserXP | null = null;
  userLevel: Models.Gamification.Level | null = null;
  userBadges: Models.Gamification.Badge[] = [];
  nextLevelXP: number = 0;
  progressToNextLevel: number = 0;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private blogService: BlogService,
    private userService: UserService,
    private authService: AuthService,
    private gamificationService: GamificationService,
    private modalCtrl: ModalController,
    private chatService: ChatService,
    private router: Router
  ) { this.isAuthenticated$ = this.authService.isAuthenticated$; }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadProfileData(userId);
    }
  }

  loadProfileData(userId: string) {
    this.isLoading = true;

    // Verificar si es el perfil del usuario actual
    const currentUser = this.authService.getUserProfile();
    this.isCurrentUserProfile = currentUser?.id === userId;

    this.adminService.getUserById(userId).subscribe(user => {
      this.userProfile = user;

      this.blogService.getBlogsByAuthorId(userId).subscribe(blogs => {
        this.userBlogs = blogs;
        // Calcular estadísticas
        this.totalLikesReceived = blogs.reduce((acc, blog) => acc + (blog.likes_count || 0), 0);
        this.totalCommentsReceived = blogs.reduce((acc, blog) => acc + (blog.comments_count || 0), 0);
      });

      this.userService.getFollowerCount(userId).subscribe(count => this.followerCount = count);
      this.userService.getFollowingCount(userId).subscribe(count => this.followingCount = count);
      this.userService.isFollowing(userId).subscribe(status => this.isFollowing = status);

      this.userService.getRatingForUser(userId).subscribe(rating => {
        this.userRating = rating;
      });

      this.loadGamificationData(userId);

      this.isLoading = false;
    });
  }

  loadGamificationData(userId: string) {
    this.gamificationService.getUserXP(userId).subscribe(xp => {
      this.userXP = xp;
      this.progressToNextLevel = (xp.xp_in_current_level / (xp.xp_in_current_level + xp.xp_to_next_level)) * 100;
    });

    this.gamificationService.getUserLevel(userId).subscribe(level => {
      this.userLevel = level;
    });

    this.gamificationService.getUserBadges(userId).subscribe(badges => {
      this.userBadges = badges;
    });
  }

  toggleFollow() {
    if (!this.userProfile) return;

    const action$ = this.isFollowing
      ? this.userService.unfollowUser(this.userProfile.id)
      : this.userService.followUser(this.userProfile.id);

    action$.subscribe(() => {
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
      const ratingValue = rating as 1 | 2 | 3 | 4 | 5;

      this.userService.rateUser(this.userProfile.id, ratingValue)
        .subscribe(() => {
          console.log(`Has calificado a ${this.userProfile?.firstName} con ${rating} estrellas.`);
        });
    }
  }

  async openEditProfile() {
    if (!this.userProfile) return;

    const modal = await this.modalCtrl.create({
      component: ProfileEditModalComponent,
      componentProps: {
        user: this.userProfile
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.userProfile = data;
      console.log('Perfil actualizado:', data);
    }
  }

  startChat() {
    if (!this.userProfile) return;

    const currentUser = this.authService.getUserProfile();
    if (!currentUser) return;

    // Crear o encontrar chat con este usuario
    this.chatService.createChat([currentUser.id, this.userProfile.id]).subscribe(chat => {
      this.router.navigate(['/chat', chat.id]);
    });
  }
}