import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Language = 'ru' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private http = inject(HttpClient);

  readonly currentLang = signal<Language>(this.getStoredLang());
  readonly translations = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      this.loadTranslations(this.currentLang());
    }, { allowSignalWrites: true });
  }

  private getStoredLang(): Language {
    const stored = localStorage.getItem('lang') as Language;
    return stored === 'en' || stored === 'ru' ? stored : 'ru';
  }

  private loadTranslations(lang: Language) {
    this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => this.translations.set(data),
      error: () => console.error(`Failed to load translations for ${lang}`)
    });
    localStorage.setItem('lang', lang);
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  toggleLanguage() {
    this.currentLang.update(l => l === 'ru' ? 'en' : 'ru');
  }

  t(key: string): string {
    return this.translations()[key] || key;
  }
}
