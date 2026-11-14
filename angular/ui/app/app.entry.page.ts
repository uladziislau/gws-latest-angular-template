import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AppInitializerService } from '../../initialization/app-initializer.service';

/**
 * Entry page — стартовая страница шаблона (эталон §10).
 *
 * Заменяет redirectTo '' → 'tests': единая точка входа,
 * уводит на рабочий раздел после инициализации.
 */
@Component({
  selector: 'app-entry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="entry-loading"><p>Loading...</p></div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .entry-loading {
      display: flex; align-items: center; justify-content: center;
      height: 100%;
    }
  `],
})
export class AppEntryPageComponent {
  private initializer = inject(AppInitializerService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.initializer.isReady()) {
        void this.router.navigateByUrl('/tests', { replaceUrl: true });
      }
    });
  }
}
