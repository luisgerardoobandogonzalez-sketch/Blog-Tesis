import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import {Models  } from 'src/app/shared/models/models'; 
import { GenderTranslatePipe } from 'src/app/shared/pipes/gender-translate-pipe';

import { BlogService } from 'src/app/shared/services/blog';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/shared/services/user'; // Importa UserService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,GenderTranslatePipe,RouterLink]
})
export class ProfilePage implements OnInit {

userProfile: Models.User.User | null = null;
  userBlogs: Models.Blog.Blog[] = [];
   followerCount = 0; // <-- Añade
  followingCount = 0; // <-- Añade
  private followSubscription!: Subscription;


   constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private userService: UserService
  ) { }

   ngOnInit() {
    this.userProfile = this.authService.getUserProfile();
    if (this.userProfile) {
      // Si tenemos un perfil, pedimos sus blogs
      this.blogService.getBlogsByAuthorId(this.userProfile.id).subscribe(blogs => {
        this.userBlogs = blogs;
      });
    }
  }

  ngOnDestroy() {
    
    if (this.followSubscription) {
      this.followSubscription.unsubscribe();
    }
  }

  loadProfileData() {
    this.userProfile = this.authService.getUserProfile();
    if (this.userProfile) {
      this.blogService.getBlogsByAuthorId(this.userProfile.id).subscribe(blogs => {
        this.userBlogs = blogs;
      });
      this.loadFollowCounts(); // <-- Llama a la nueva función
    }
  }

  // --- NUEVA FUNCIÓN ---
  loadFollowCounts() {
    if (this.userProfile) {
      this.userService.getFollowerCount(this.userProfile.id).subscribe(count => this.followerCount = count);
      this.userService.getFollowingCount(this.userProfile.id).subscribe(count => this.followingCount = count);
    }
  }




}