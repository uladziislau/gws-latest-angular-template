import {
  ApplicationConfig,
  ErrorHandler,
  provideZonelessChangeDetection,
  APP_INITIALIZER
} from '@angular/core';
import {provideRouter, withComponentInputBinding, withViewTransitions} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

import {routes} from './app.routes';
import {GlobalErrorHandler} from './services/error-handler.service';
import {AppInitializerService} from './initialization/app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // Инициализация приложения (эталон §10): theme/i18n прогрев.
    { provide: APP_INITIALIZER, useFactory: (init: AppInitializerService) => () => init.init(), deps: [AppInitializerService], multi: true },
  ],
};
