import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { AuthService } from './core/services/auth';

// 1. Importa la función addIcons
import { addIcons } from 'ionicons';

// 2. Importa los íconos que vas a usar (usa el nombre en camelCase)
import { homeOutline, personOutline, createOutline, settingsOutline, menuOutline, logOutOutline, personCircleOutline, searchOutline, logInOutline, logoFacebook, logoGoogle, analyticsOutline, peopleOutline, eyeOutline, pencilOutline, banOutline, barChartOutline, checkmarkCircle, atCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, // Convertimos AppComponent a standalone también
  imports: [
    IonicModule,
    MenuComponent,
    HeaderComponent,
    CommonModule,
    RouterModule,  
  ],
})
export class AppComponent {

  constructor(public authService: AuthService) {
    // 3. Llama a addIcons en el constructor con los íconos importados
    // La llave es el nombre que usas en el HTML (kebab-case)
    // El valor es la variable que importaste (camelCase)
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
  analyticsOutline,  // <-- Ícono para Analíticas (nuevo)
  peopleOutline,     // <-- Ícono para Usuarios (nuevo)
  eyeOutline,        // <-- Íconos para Acciones de Admin (nuevos)
  pencilOutline,
  banOutline,
  barChartOutline,
  checkmarkCircleOutline,
     // <-- Ícono para el gráfico de Analytics (nuevo)

    });
  }
}
