import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { Router } from '@angular/router';
import { CreateBlogModalComponent } from '../create-blog-modal/create-blog-modal.component';
import { BlogService } from '../../services/blog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HeaderComponent {
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private blogService: BlogService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  async openAuthModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
    });
    await modal.present();
  }

    async openCreateBlogModal() {
    const modal = await this.modalCtrl.create({
      component: CreateBlogModalComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const user = this.authService.getUserProfile();
      if (user && data) {
        // Llamamos al servicio para crear el blog con los datos del modal y el ID del usuario
        this.blogService.createBlog(data, user.id).subscribe(newBlog => {
          console.log('Blog guardado exitosamente desde el Header');
        });
      }
    }
  }

  // --- Funciones para los nuevos botones ---

  navigateToSearch() {
    console.log('Navegando a la página de búsqueda...');
    // this.router.navigate(['/search']);
  }

  navigateToCreatePost() {
    console.log('Navegando a la página de creación de post...');
    // this.router.navigate(['/create-blog']);
  }

    async viewProfile(path: string, requiresAuth: boolean = false) {
    let canNavigate = true;
    if (requiresAuth) {
      this.isAuthenticated$.subscribe(async isAuth => {
        if (!isAuth) {
          canNavigate = false;
          const modal = await this.modalCtrl.create({
            component: AuthModalComponent,
          });
          await modal.present();
        }
      }).unsubscribe();
    }

    if (canNavigate) {
      this.router.navigate([path]);
     // this.menuCtrl.close();
    }
  }

   async logout() {
    // Luego llamamos al servicio de autenticación para que haga el trabajo
    this.authService.logout();
  }
}