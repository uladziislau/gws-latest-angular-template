import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private mediaQuery = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      this.document.documentElement.classList.toggle('dark', current === 'dark');
      localStorage.setItem('theme', current);
    });

    this.mediaQuery?.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  set(theme: Theme) {
    this.theme.set(theme);
  }
}
