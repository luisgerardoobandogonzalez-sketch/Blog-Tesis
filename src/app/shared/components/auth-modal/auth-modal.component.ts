import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar,IonTitle, IonButton, IonContent, IonIcon  } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonIcon,IonicModule],
})
export class AuthModalComponent  implements OnInit {

  constructor(/* private modalCtrl: ModalController */) { }

  ngOnInit() {}

  // Controla qué vista se muestra: 'login', 'register', o 'verify'
  view: 'login' | 'register' | 'verify' = 'login';



  // Cambia entre las vistas del modal
  changeView(newView: 'login' | 'register' | 'verify') {
    this.view = newView;
  }

  // Cierra el modal
  dismiss() {
    //this.modalCtrl.dismiss();
  }

  // --- Lógica de Frontend para la autenticación ---
  // El backend hace el trabajo pesado, el frontend solo inicia el proceso

  // Para Google/Facebook:
  // 1. Llamarías a una librería de Capacitor/Cordova o una SDK web.
  // 2. Esta te devolverá un "token de acceso" o "código de autorización".
  // 3. Envías ese token/código a tu backend.
  // 4. Tu backend lo valida con Google/Facebook, crea el usuario si no existe,
  //    genera un token JWT propio y te lo devuelve.

  loginWithGoogle() {
    console.log('Iniciando sesión con Google...');
    // Aquí iría la lógica para llamar a la API de Google
    // al tener exito this.authService.handleLogin(response);
    // y this.dismiss();
  }

  loginWithFacebook() {
    console.log('Iniciando sesión con Facebook...');
    // Aquí iría la lógica para llamar a la API de Facebook
    // al tener exito this.authService.handleLogin(response);
    // y this.dismiss();
  }

  // ... métodos similares para loginWithFacebook, registerWithEmail, etc.

  registerWithEmail() {
    // 1. Recolectas email/password del formulario.
    // 2. Lo envías a tu endpoint de registro en el backend.
    // 3. El backend crea el usuario (con is_verified=false), genera un código
    //    y envía el correo.
    // 4. Si la respuesta del backend es exitosa, cambias la vista.
    this.changeView('verify');
  }

   registerWithGoogle() {
    // 1. Recolectas email/password del formulario.
    // 2. Lo envías a tu endpoint de registro en el backend.
    // 3. El backend crea el usuario (con is_verified=false), genera un código
    //    y envía el correo.
    // 4. Si la respuesta del backend es exitosa, cambias la vista.
    this.changeView('verify');
  }

   registerWithFacebook() {
    // 1. Recolectas email/password del formulario.
    // 2. Lo envías a tu endpoint de registro en el backend.
    // 3. El backend crea el usuario (con is_verified=false), genera un código
    //    y envía el correo.
    // 4. Si la respuesta del backend es exitosa, cambias la vista.
    this.changeView('verify');
  }

  verifyCode() {
    // 1. Recolectas el código del input.
    // 2. Lo envías a tu endpoint de verificación en el backend junto con el email.
    // 3. El backend valida el código. Si es correcto, pone is_verified=true,
    //    genera el JWT y te lo devuelve.
    // 4. Manejas el login en el frontend y cierras el modal.
  }

}
