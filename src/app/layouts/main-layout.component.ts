import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../core/i18n.service';
import { ThemeService } from '../core/theme.service';
import { GlobalErrorHandler } from '../core/error-handler.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500/30 transition-colors duration-300">
      <!-- Global Error Banner -->
      @if (errorHandler.errors().length > 0) {
        <div class="fixed top-0 left-0 right-0 z-50 p-4">
          <div class="max-w-3xl mx-auto space-y-2">
            @for (error of errorHandler.errors(); track error.timestamp) {
              <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 animate-[fadeIn_0.3s_ease-out]">
                <span class="text-sm">{{ error.message }}</span>
                <button
                  (click)="errorHandler.dismissError($index)"
                  class="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- Top Navigation -->
      <header class="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-300">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tracking-[-0.02em]">
              {{ i18n.t('layout.title.part1') }} <span class="text-zinc-500 font-medium tracking-normal">{{ i18n.t('layout.title.part2') }}</span>
            </h1>
          </div>
          <nav class="flex items-center gap-3">
            <a routerLink="/docs"
               routerLinkActive="text-indigo-600 dark:text-indigo-400 font-medium"
               class="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {{ i18n.t('nav.docs') }}
            </a>
            <a routerLink="/tests"
               routerLinkActive="text-indigo-600 dark:text-indigo-400 font-medium"
               class="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {{ i18n.t('nav.tests') }}
            </a>
            <div class="h-4 w-px bg-zinc-200 dark:bg-zinc-800 ml-1"></div>

            <!-- Theme Toggle -->
            <button
              (click)="themeService.toggle()"
              class="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
              @if (themeService.theme() === 'dark') {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              }
            </button>

            <!-- Language Toggle -->
            <button
              (click)="i18n.toggleLanguage()"
              class="flex items-center justify-center gap-1.5 h-8 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ i18n.currentLang() === 'ru' ? 'RU' : 'EN' }}
            </button>
          </nav>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="container mx-auto px-4 py-8 max-w-5xl">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  i18n = inject(I18nService);
  themeService = inject(ThemeService);
  errorHandler = inject(GlobalErrorHandler);
}
