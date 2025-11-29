import { Component } from '@angular/core';

import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class AdminMenuComponent {
  constructor(
    private authService: AuthService,
    private menuCtrl: MenuController
  ) { }

  logout() {
    this.menuCtrl.close();
    this.authService.logout();
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}