import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { Router } from '@angular/router';
import { CreateBlogModalComponent } from '../create-blog-modal/create-blog-modal.component';
import { BlogService } from '../../services/blog';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HeaderComponent {
  public isAuthenticated$: Observable<boolean>;
  public isSearchActive = false;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private blogService: BlogService,
    private alertCtrl: AlertController
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
        this.blogService.createBlog(data, user.id).subscribe(newBlog => {
          if (newBlog.moderation.status === 'pending') {
            this.showModerationAlert();
          }
        });
      }
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


    navigateToNotifications() {
    this.router.navigate(['/notifications']);
  }

   toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  onSearch(event: any) {
    const query = event.target.value;
    this.blogService.performSearch(query);
  }
}