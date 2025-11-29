import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminService } from '../services/admin';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BaseChartDirective]
})
export class AnalyticsPage implements OnInit {
  summaryData: any = null;
  isLoading = true;

  // Datos para gráfico de líneas (Actividad diaria)
  public lineChartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [12, 19, 15, 25, 22, 30, 28],
        label: 'Publicaciones',
        borderColor: '#3880ff',
        backgroundColor: 'rgba(56, 128, 255, 0.2)',
        fill: true,
      },
      {
        data: [7, 11, 8, 15, 12, 18, 20],
        label: 'Comentarios',
        borderColor: '#5260ff',
        backgroundColor: 'rgba(82, 96, 255, 0.2)',
        fill: true,
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Datos para gráfico de barras (Usuarios por categoría)
  public barChartData: ChartData<'bar'> = {
    labels: ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Otros'],
    datasets: [
      {
        data: [45, 30, 25, 20, 15],
        label: 'Usuarios',
        backgroundColor: ['#3880ff', '#5260ff', '#51a9d0', '#2dd36f', '#ffc409']
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    }
  };

  public barChartType: ChartType = 'bar';

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAnalyticsSummary().subscribe(data => {
      this.summaryData = data;
      this.isLoading = false;
    });
  }
}