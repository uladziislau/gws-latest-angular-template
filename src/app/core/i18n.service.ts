import { Injectable, signal, computed } from '@angular/core';

export type Language = 'ru' | 'en';

const translations = {
  ru: {
    'layout.title.part1': 'Универсальный',
    'layout.title.part2': 'Шаблон',
    'nav.home': 'Главная',
    'nav.docs': 'Документация',
    'nav.tests': 'Тесты',
    'docs.title': 'Документация',
    'docs.subtitle': 'Руководство',
    'docs.loading': 'Загрузка...',
    'docs.error': 'Не удалось загрузить документацию.',
    'tests.systems.operational': 'Все системы работают нормально',
    'tests.systems.offline': 'Системы отключены',
    'tests.runner': 'Запуск тестов',
    'tests.runBtn': 'Запустить тесты',
    'tests.running': 'Выполняется...',
    'tests.clickToRun': 'Нажмите "Запустить тесты", чтобы запустить проверку окружения...',
    'tests.testFiles': 'Файлы тестов',
    'tests.tests': 'Тесты',
    'tests.duration': 'Время выполнения',
    'tests.passed': 'успешно',
  },
  en: {
    'layout.title.part1': 'Universal',
    'layout.title.part2': 'Template',
    'nav.home': 'Home',
    'nav.docs': 'Documentation',
    'nav.tests': 'Tests',
    'docs.title': 'Documentation',
    'docs.subtitle': 'Guide',
    'docs.loading': 'Loading...',
    'docs.error': 'Failed to load documentation.',
    'tests.systems.operational': 'All Systems Operational',
    'tests.systems.offline': 'Systems Offline',
    'tests.runner': 'Live Test Runner',
    'tests.runBtn': 'Run tests',
    'tests.running': 'Running...',
    'tests.clickToRun': 'Click "Run tests" to start the environment check...',
    'tests.testFiles': 'Test Files',
    'tests.tests': 'Tests',
    'tests.duration': 'Duration',
    'tests.passed': 'passed',
  }
};

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  readonly currentLang = signal<Language>('ru');

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }
  
  toggleLanguage() {
    this.currentLang.update(l => l === 'ru' ? 'en' : 'ru');
  }

  t = computed(() => {
    const lang = this.currentLang();
    return (key: keyof typeof translations['ru']) => translations[lang][key] || key;
  });
}
