import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular'; // Importa AlertController
import { AdminService } from '../services/admin';
import { Models } from 'src/app/shared/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UsersPage implements OnInit {
  users: Models.User.User[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private alertCtrl: AlertController, // Inyecta el controlador de alertas
    private router: Router // <-- Inyéctalo
  ) { }

  ngOnInit() {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
      this.isLoading = false;
    });
  }

  // --- Funciones para los botones de acción (simuladas) ---

 viewUser(user: Models.User.User) {
    console.log('Navegando al perfil de:', user.firstName);
    // Navegamos a la nueva ruta, pasándole el ID del usuario
    this.router.navigate(['/user', user.id]);
  }

  editUser(user: Models.User.User) {
    console.log('Editando usuario:', user.firstName);
    // Aquí abrirías un modal con un formulario para editar los datos del usuario.
  }

  async suspendUser(user: Models.User.User) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Suspensión',
      message: `¿Estás seguro de que quieres suspender a ${user.firstName} ${user.lastName}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Suspender',
          handler: () => {
            console.log(`Usuario ${user.firstName} suspendido.`);
            // Aquí llamarías al servicio para actualizar el estado del usuario en la BD.
            // Para la simulación, podemos cambiar el estado localmente:
            user.status = 'suspended';
          },
        },
      ],
    });
    await alert.present();
  }

  async activateUser(user: Models.User.User) {
  const alert = await this.alertCtrl.create({
    header: 'Confirmar Activación',
    message: `¿Estás seguro de que quieres volver a activar a ${user.firstName} ${user.lastName}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Activar',
        handler: () => {
          console.log(`Usuario ${user.firstName} activado.`);
          // Para la simulación, cambiamos el estado localmente.
          user.status = 'active';
        },
      },
    ],
  });
  await alert.present();
}

}