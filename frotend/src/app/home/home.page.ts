import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth';
import { CreateBlogModalComponent } from 'src/app/shared/components/create-blog-modal/create-blog-modal.component';
import { Subscription } from 'rxjs';
import { AuthModalComponent } from 'src/app/shared/components/auth-modal/auth-modal.component';
import { take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { FavoritesService } from 'src/app/shared/services/favorites';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {


  public allBlogs: Models.Blog.Blog[] = [];
  public displayedBlogs: Models.Blog.Blog[] = [];
  public isLoading = true;
  private blogAddedSubscription!: Subscription;
  private searchSubscription!: Subscription;
  private savedBlogIds: Set<string> = new Set();


  public availableCareers: string[] = [];
  public availableCategories: string[] = [];
  public selectedFilters = {
    career: 'all',
    category: 'all'
  };


  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    this.loadAllBlogs();
    this.loadSavedBlogs();

    this.blogAddedSubscription = this.blogService.blogAdded$.subscribe(() => {
      this.loadAllBlogs();
    });
    this.searchSubscription = this.blogService.searchQuery$.subscribe(query => {
      this.blogService.searchBlogs(query).subscribe(results => {
        this.displayedBlogs = results;
      });
    });
  }

  ngOnDestroy() {
    this.blogAddedSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

  loadAllBlogs() {
    this.isLoading = true;
    this.blogService.getBlogs(this.selectedFilters).subscribe(data => {
      this.allBlogs = data;
      this.displayedBlogs = data;
      this.isLoading = false;
    });
  }

  loadSavedBlogs() {
    this.favoritesService.getFavorites().subscribe(savedBlogs => {
      this.savedBlogIds = new Set(savedBlogs.map(blog => blog._id));
    });
  }

  isBlogSaved(blogId: string): boolean {
    return this.savedBlogIds.has(blogId);
  }

  toggleBookmark(blogId: string, event: Event) {
    event.stopPropagation();

    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        if (this.isBlogSaved(blogId)) {
          this.favoritesService.unsaveBlog(blogId).subscribe(success => {
            if (success) {
              this.savedBlogIds.delete(blogId);
            }
          });
        } else {
          this.favoritesService.saveBlog(blogId).subscribe(success => {
            if (success) {
              this.savedBlogIds.add(blogId);
            }
          });
        }
      } else {
        this.openAuthModal();
      }
    });
  }

  viewBlogDetail(blogId: string) {
    this.router.navigate(['/blog', blogId]);
  }

  async openCreateBlogModal() {
    const currentUser = this.authService.getUserProfile();
    if (!currentUser) {
      this.openAuthModal();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: CreateBlogModalComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.blogService.createBlog(data, currentUser.id).subscribe(newBlog => {
        if (newBlog.moderation.status === 'pending') {
          this.showModerationAlert();
        }
      });
    }
  }

  async showModerationAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Publicación en Revisión',
      message: 'Tu publicación contiene palabras que requieren revisión. Un administrador la revisará y aprobará pronto.',
      buttons: ['Entendido'],
    });
    await alert.present();
  }

  toggleLikeOnList(blog: Models.Blog.Blog, event: Event) {
    event.stopPropagation();

    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        if (blog.currentUserHasLiked) {
          this.blogService.unlikeBlog(blog._id).subscribe();
        } else {
          this.blogService.likeBlog(blog._id).subscribe();
        }
      } else {
        this.openAuthModal();
      }
    });
  }

  async openAuthModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
    });
    await modal.present();
  }

  loadFilterOptions() {
    this.blogService.getAvailableCareers().subscribe(careers => this.availableCareers = careers);
    this.blogService.getAvailableCategories().subscribe(categories => this.availableCategories = categories);
  }

  onFilterChange() {
    console.log('Filtros aplicados:', this.selectedFilters);
    this.loadAllBlogs();
  }

}
