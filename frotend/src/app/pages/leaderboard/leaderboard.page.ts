import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GamificationService } from 'src/app/shared/services/gamification';
import { Models } from 'src/app/shared/models/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LeaderboardPage implements OnInit {

  leaderboard: Models.Gamification.LeaderboardEntry[] = [];
  isLoading = true;

  constructor(private gamificationService: GamificationService) { }

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.isLoading = true;
    this.gamificationService.getLeaderboard(20).subscribe(data => {
      this.leaderboard = data;
      this.isLoading = false;
    });
  }

  doRefresh(event: any) {
    this.gamificationService.getLeaderboard(20).subscribe(data => {
      this.leaderboard = data;
      event.target.complete();
    });
  }

  getRankIcon(rank: number): string {
    switch (rank) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'medal';
      default: return 'ribbon';
    }
  }

  getRankColor(rank: number): string {
    switch (rank) {
      case 1: return 'warning'; // Gold
      case 2: return 'medium';  // Silver
      case 3: return 'danger';  // Bronze
      default: return 'primary';
    }
  }

}
