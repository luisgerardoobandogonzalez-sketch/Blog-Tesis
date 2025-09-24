import { Component, OnDestroy,OnInit } from '@angular/core';
import { BlogService } from 'src/app/shared/services/blog';
import { Blog } from 'src/app/shared/models/blog.model';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth';
import { ModalController } from '@ionic/angular';
import { CreateBlogModalComponent } from 'src/app/shared/components/create-blog-modal/create-blog-modal.component';
import { Subscription } from 'rxjs'; // Importa Subscription


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

   public blogs: Blog[] = [];
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
}
