import { Component } from '@angular/core';

import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // <-- Importante para [(ngModel)]
import { AuthService } from 'src/app/core/services/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], // <-- Añade FormsModule
})
export class AuthModalComponent {
  view: 'login' | 'register' | 'verify' = 'login';

  // Objeto para almacenar los datos del formulario de login
  credentials = {
    email: '',
    password: ''
  };

   registrationData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '', // Nuevo campo
    email: '',
    password: ''
  };

   constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController, // <-- Inyéctalo aquí
    private router: Router // <-- Inyéctalo aquí
  ) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  changeView(newView: 'login' | 'register' | 'verify') {
    this.view = newView;
  }

  // --- Lógica de Frontend para la autenticación ---
  
   loginWithEmail() {
    // 3. Llama al método login del servicio
    this.authService.login(this.credentials).subscribe({
      next: (success) => {
        if (success) {
          console.log('Login simulado exitoso!');
          // 4. Si el login es exitoso, cierra el modal
          this.modalCtrl.dismiss({ loggedIn: true });
        }
      },
      error: (err) => {
        console.error('Error en el login simulado', err);
        // Aquí podrías mostrar una alerta de error
      }
    });
  }

  loginWithGoogle() {
    console.log('Iniciando sesión con Google...');
    // Lógica para llamar a la SDK de Google
  }

  loginWithFacebook() {
    console.log('Iniciando sesión con Facebook...');
    // Lógica para llamar a la SDK de Facebook
  }

  async registerWithEmail() {
    // 1. Validación de Fecha de Nacimiento
    if (!this.registrationData.birthDate) {
      this.showAlert('Error', 'Debes seleccionar tu fecha de nacimiento.');
      return;
    }

    const birthDate = new Date(this.registrationData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      // Si el cumpleaños de este año aún no ha pasado, resta un año
      if (age - 1 < 18) {
        this.showAlert('Edad no permitida', 'Debes ser mayor de 18 años para registrarte.');
        return;
      }
    } else if (age < 18) {
      this.showAlert('Edad no permitida', 'Debes ser mayor de 18 años para registrarte.');
      return;
    }
    
    // 2. Simulación de Registro Exitoso
    console.log('Registro válido. Guardando datos para prueba...');

    // Crea el perfil del usuario con los datos del formulario
    const userProfile = {
      id: `user_${Date.now()}`, // ID de usuario falso
      ...this.registrationData
    };
    delete (userProfile as any).password; // Nunca guardes la contraseña

    // Simula la creación de un token JWT
    const fakeToken = btoa(JSON.stringify({ userId: userProfile.id }));

    // 3. Guarda todo en localStorage
    localStorage.setItem('auth_token', fakeToken);
    localStorage.setItem('user_profile', JSON.stringify(userProfile));

    // 4. Actualiza el estado de la app y redirige
    // (Llamamos a 'checkToken' del servicio para que actualice el estado)
    (this.authService as any).checkToken(); 
    
    await this.modalCtrl.dismiss();
    this.router.navigate(['/home']);
  }

  // Función de ayuda para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

 registerWithGoogle(){
  console.log("Registrando se con Google");
 }

  registerWithFacebook(){
    console.log("Registrando se con Facebook");
  }
}