import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AdminService } from '../services/admin';
import { Models } from 'src/app/shared/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, TitleCasePipe]
})
export class ReportsPage implements OnInit {
  reports: Models.Report.Report[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.adminService.getReports().subscribe(data => {
      this.reports = data;
      this.isLoading = false;
    });
  }

  // Navega al contenido reportado para que el admin pueda verlo
  viewContent(report: Models.Report.Report) {
    if (report.content_type === 'blog') {
      this.router.navigate(['/blog', report.reported_content_id]);
    } else {
      // Para un comentario, navegamos al blog y podríamos pasar un parámetro para hacer scroll (más avanzado)
      console.log('Navegar al blog del comentario y buscar el comentario ID:', report.reported_content_id);
    }
  }

  // Actualiza el estado de un reporte
  async updateStatus(report: Models.Report.Report, status: 'reviewed' | 'resolved') {
    const alert = await this.alertCtrl.create({
      header: `Marcar como '${status}'`,
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.adminService.updateReportStatus(report._id, status).subscribe();
          },
        },
      ],
    });
    await alert.present();
  }
}