// Importa CommonModule para *ngIf y el pipe async
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Importa IonicModule para usar todos los componentes de Ionic
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  // 1. Asegúrate de que es standalone
  standalone: true,
  // 2. Importa los módulos necesarios aquí
  imports: [
    IonicModule,    // Para los componentes <ion-header>, <ion-list>, etc.
    CommonModule    // Para las directivas *ngIf, *ngFor, y el pipe | async
  ],
})
export class MenuComponent {
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  // ... (el resto de tu lógica no cambia)
  async navigateTo(path: string, requiresAuth: boolean = false) {
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
      this.menuCtrl.close();
    }
  }
}
