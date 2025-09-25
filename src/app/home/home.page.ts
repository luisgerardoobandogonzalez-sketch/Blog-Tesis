import { Component, OnDestroy,OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog';
import { Models } from 'src/app/shared/models/models';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth';
import { CreateBlogModalComponent } from 'src/app/shared/components/create-blog-modal/create-blog-modal.component';
import { Subscription } from 'rxjs'; // Importa Subscription
import { AuthModalComponent } from 'src/app/shared/components/auth-modal/auth-modal.component';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit, OnDestroy {

   public blogs: Models.Blog.Blog[] = [];
  public isLoading = true;
  private blogAddedSubscription!: Subscription; // 

  constructor(
    private blogService: BlogService,
    private authService: AuthService, // Inyecta AuthService
    private modalCtrl: ModalController, // Inyecta ModalController
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBlogs();
    // Nos suscribimos a los eventos de nuevos blogs
    this.blogAddedSubscription = this.blogService.blogAdded$.subscribe(() => {
      this.loadBlogs(); // Recargamos los blogs cuando se añade uno nuevo
    });
  }
   ngOnDestroy() {
    // Es una buena práctica desuscribirse para evitar fugas de memoria
    this.blogAddedSubscription.unsubscribe();
  }

  loadBlogs() {
    this.isLoading = true; // Empezamos a cargar
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data; // Guardamos los blogs
        this.isLoading = false; // Terminamos de cargar
      },
      error: (err) => {
        console.error('Error al cargar los blogs', err);
        this.isLoading = false; // Terminamos de cargar incluso si hay error
      }
    }); 
  }

  // Esta función te servirá para cuando el usuario haga clic en un blog
  viewBlogDetail(blogId: string) {
    // Usamos el router para navegar a la nueva ruta, ej: '/blog/abcde12345'
    this.router.navigate(['/blog', blogId]);
  }

    async openCreateBlogModal() {
    const modal = await this.modalCtrl.create({ component: CreateBlogModalComponent });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const user = this.authService.getUserProfile();
      if (user && data) {
        this.blogService.createBlog(data, user.id).subscribe();
      }
    }
  }


 toggleLikeOnList(blog: Models.Blog.Blog, event: Event) {
    event.stopPropagation(); // Previene la navegación
    
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(isAuth => {
      if (isAuth) {
        // Lógica de siempre
        if (blog.currentUserHasLiked) {
          this.blogService.unlikeBlog(blog._id).subscribe();
        } else {
          this.blogService.likeBlog(blog._id).subscribe();
        }
      } else {
        // Abrir modal
        this.openAuthModal();
      }
    });
  }

  // --- NUEVA FUNCIÓN DE AYUDA ---
  async openAuthModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
    });
    await modal.present();
  }

}
