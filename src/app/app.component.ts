import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuComponent } from './shared/components/menu/menu.component';

// 1. Importa la función addIcons
import { addIcons } from 'ionicons';

// 2. Importa los íconos que vas a usar (usa el nombre en camelCase)
import { homeOutline, personOutline, createOutline, settingsOutline, menuOutline } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true, // Convertimos AppComponent a standalone también
  imports: [
    IonicModule,
    MenuComponent,
    HeaderComponent,
  ],
})
export class AppComponent {

  constructor() {
    // 3. Llama a addIcons en el constructor con los íconos importados
    // La llave es el nombre que usas en el HTML (kebab-case)
    // El valor es la variable que importaste (camelCase)
    addIcons({
      'home-outline': homeOutline,
      'person-outline': personOutline,
      'create-outline': createOutline,
      'settings-outline': settingsOutline,
      'menu-outline': menuOutline,
      // ...agrega aquí cualquier otro ícono que necesites en tu app
    });
  }
}
