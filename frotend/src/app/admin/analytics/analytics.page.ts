import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminService } from '../services/admin';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AnalyticsPage implements OnInit {
  summaryData: any = null;
  isLoading = true;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAnalyticsSummary().subscribe(data => {
      this.summaryData = data;
      this.isLoading = false;
    });
  }
}