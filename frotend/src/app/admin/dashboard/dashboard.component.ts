
import { Component, OnInit } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule
]
})
export class DashboardComponent  implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {}

  AuthService = AuthService;

   logout() {
    this.authService.logout();
  }

}
