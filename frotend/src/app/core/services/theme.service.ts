import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app_theme';
    private darkMode = false;

    constructor() {
        this.loadTheme();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        this.darkMode = savedTheme === 'dark';
        this.applyTheme();
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.applyTheme();
        this.saveTheme();
    }

    isDarkMode(): boolean {
        return this.darkMode;
    }

    private applyTheme() {
        if (this.darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    private saveTheme() {
        localStorage.setItem(this.THEME_KEY, this.darkMode ? 'dark' : 'light');
    }
}
