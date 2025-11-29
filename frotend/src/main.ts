import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// 1. Importa el proveedor de HttpClient
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsGT from '@angular/common/locales/es-GT';

// Chart.js registration
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

registerLocaleData(localeEsGT, 'es-GT');

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(), { provide: LOCALE_ID, useValue: 'es-GT' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // 2. Añade el proveedor aquí
    provideHttpClient(),
  ],
});
