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
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {

   
  public allBlogs: Models.Blog.Blog[] = []; // Guardará la lista original y completa de blogs
  public displayedBlogs: Models.Blog.Blog[] = []; // Esta es la lista que se muestra y se filtra
  public isLoading = true;
  private blogAddedSubscription!: Subscription;
  private searchSubscription!: Subscription;
   

   public availableCareers: string[] = [];
  public availableCategories: string[] = [];
  public selectedFilters = {
    career: 'all', // Valor por defecto
    category: 'all' // Valor por defecto
  };
  

  constructor(
    private blogService: BlogService,
    private authService: AuthService, // Inyecta AuthService
    private modalCtrl: ModalController, // Inyecta ModalController
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadAllBlogs();
    // Nos suscribimos a los eventos de nuevos blogs
    this.blogAddedSubscription = this.blogService.blogAdded$.subscribe(() => {
      this.loadAllBlogs(); // Recargamos los blogs cuando se añade uno nuevo
    });
     this.searchSubscription = this.blogService.searchQuery$.subscribe(query => {
      this.blogService.searchBlogs(query).subscribe(results => {
        this.displayedBlogs = results;
      });
    });
  }
   ngOnDestroy() {
    // Es una buena práctica desuscribirse para evitar fugas de memoria
    this.blogAddedSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }

    loadAllBlogs() {
    this.isLoading = true;
    // Ahora pasamos los filtros seleccionados al servicio
    this.blogService.getBlogs(this.selectedFilters).subscribe(data => {
      this.allBlogs = data;
      this.displayedBlogs = data;
      this.isLoading = false;
    });
  }



  // Esta función te servirá para cuando el usuario haga clic en un blog
  viewBlogDetail(blogId: string) {
    // Usamos el router para navegar a la nueva ruta, ej: '/blog/abcde12345'
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
        // Revisa el estado de moderación del nuevo blog
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

    loadFilterOptions() {
    this.blogService.getAvailableCareers().subscribe(careers => this.availableCareers = careers);
    this.blogService.getAvailableCategories().subscribe(categories => this.availableCategories = categories);
  }

  // --- NUEVA FUNCIÓN QUE SE LLAMA AL CAMBIAR UN FILTRO ---
  onFilterChange() {
    console.log('Filtros aplicados:', this.selectedFilters);
    this.loadAllBlogs();
  }

}
