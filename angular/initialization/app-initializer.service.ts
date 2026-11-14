import { Injectable, inject, signal, computed } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { ThemeService } from '../services/theme.service';

export type InitState = 'pending' | 'running' | 'ready' | 'failed';

/**
 * Сервис инициализации приложения (эталон §10).
 *
 * Прогревает theme/i18n сервисы: их constructor-эффекты уже
 * запускают загрузку, init() дожидается первого перевода,
 * чтобы entry page не показал сырой UI без локализации.
 */
@Injectable({ providedIn: 'root' })
export class AppInitializerService {
  private i18n = inject(I18nService);
  private theme = inject(ThemeService);

  readonly state = signal<InitState>('pending');
  readonly error = signal<string | null>(null);
  readonly isReady = computed(() => this.state() === 'ready');

  init(): Promise<void> {
    if (this.state() !== 'pending') {
      return Promise.resolve();
    }
    this.state.set('running');
    // Трогаем сервисы: конструкторы регистрируют эффекты загрузки.
    this.theme.theme();
    this.i18n.currentLang();
    // Ждём первый непустой набор переводов (или таймаут 3с —
    // сеть может быть медленной, bootstrap не блокируем вечно).
    return new Promise<void>((resolve) => {
      const started = Date.now();
      const timer = setInterval(() => {
        const done = Object.keys(this.i18n.translations()).length > 0;
        if (done || Date.now() - started > 3000) {
          clearInterval(timer);
          this.state.set('ready');
          resolve();
        }
      }, 50);
    });
  }
}
