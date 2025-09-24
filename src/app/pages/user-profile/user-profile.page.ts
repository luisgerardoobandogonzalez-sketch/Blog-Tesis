import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from 'src/app/admin/services/admin';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,RouterLink]
})
export class UserProfilePage implements OnInit {
  userProfile: Models.User.User | null | undefined = null;
  userBlogs: Models.Blog.Blog[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private blogService: BlogService
  ) { }

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
    }
  }
}