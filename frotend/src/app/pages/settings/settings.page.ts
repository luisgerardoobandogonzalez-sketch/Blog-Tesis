import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  darkMode = false;

  constructor(public themeService: ThemeService) { }

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.darkMode = this.themeService.isDarkMode();
  }

  exportUserData() {
    const userData = {
      profile: JSON.parse(localStorage.getItem('user_profile') || '{}'),
      settings: {
        theme: localStorage.getItem('app_theme'),
        notifications: true
      },
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `user_data_${new Date().getTime()}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
