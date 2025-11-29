import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { AuthService } from './core/services/auth';
import { ThemeService } from './core/services/theme.service';

import { addIcons } from 'ionicons';

import { homeOutline, personOutline, createOutline, settingsOutline, menuOutline, logOutOutline, personCircleOutline, searchOutline, logInOutline, logoFacebook, logoGoogle, analyticsOutline, peopleOutline, eyeOutline, pencilOutline, banOutline, barChartOutline, checkmarkCircle, atCircleOutline, checkmarkCircleOutline, heartOutline, chatbubbleOutline, heart, sendOutline, trashOutline, notificationsOutline, arrowBackOutline, documentTextOutline, starOutline, star, checkmarkDoneOutline, closeCircleOutline, shieldCheckmark, shieldCheckmarkOutline, alertCircleOutline, chatbubble, personAdd, chatbubblesOutline, downloadOutline, moonOutline, sunnyOutline, pricetagsOutline, trophyOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminMenuComponent } from './admin/admin-menu/admin-menu.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MenuComponent,
    HeaderComponent,
    CommonModule,
    RouterModule,
    AdminMenuComponent,
    AdminHeaderComponent,
  ],
})
export class AppComponent {

  constructor(public authService: AuthService, private themeService: ThemeService) {
    addIcons({
      homeOutline,
      personOutline,
      createOutline,
      settingsOutline,
      menuOutline,
      logInOutline,
      searchOutline,
      personCircleOutline,
      logOutOutline,
      logoGoogle,
      logoFacebook,
      analyticsOutline,
      peopleOutline,
      eyeOutline,
      pencilOutline,
      banOutline,
      barChartOutline,
      checkmarkCircleOutline,
      heartOutline,
      chatbubbleOutline,
      heart,
      sendOutline,
      trashOutline,
      notificationsOutline,
      checkmarkCircle,
      atCircleOutline,
      arrowBackOutline,
      documentTextOutline,
      starOutline,
      star,
      checkmarkDoneOutline,
      closeCircleOutline,
      shieldCheckmarkOutline,
      alertCircleOutline,
      chatbubble,
      personAdd,
      chatbubblesOutline,
      downloadOutline,
      moonOutline,
      sunnyOutline,
      pricetagsOutline,
      trophyOutline,
    });
  }
}
