import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { User } from 'src/app/shared/models/user.model'; 
import { GenderTranslatePipe } from 'src/app/shared/pipes/gender-translate-pipe';
import { Blog } from 'src/app/shared/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,GenderTranslatePipe,RouterLink]
})
export class ProfilePage implements OnInit {

userProfile: User | null = null;
  userBlogs: Blog[] = [];

   constructor(
    private authService: AuthService,
    private blogService: BlogService // Inyecta BlogService
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
}