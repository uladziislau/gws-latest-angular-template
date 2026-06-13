import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { I18nService, Language } from '../../core/i18n.service';

@Component({
  selector: 'app-documentation-viewer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto py-12 px-6">
      <div class="p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 gap-4">
            <span class="w-8 h-8 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-indigo-500 animate-spin"></span>
            <span class="text-sm text-zinc-500">{{ i18n.t()('docs.loading') }}</span>
          </div>
        } @else if (error()) {
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            {{ i18n.t()('docs.error') }}
          </div>
        } @else {
          <article 
            class="prose prose-zinc dark:prose-invert prose-indigo max-w-none prose-headings:font-semibold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-500"
            [innerHTML]="htmlContent()"
          >
          </article>
        }
      </div>
    </div>
  `
})
export class DocumentationViewerComponent {
  i18n = inject(I18nService);
  
  htmlContent = signal<string>('');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.fetchMarkdown(this.i18n.currentLang());
    });
  }

  async fetchMarkdown(lang: Language) {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      // Fetches the markdown from the docs folder we exposed as assets
      const fileName = lang === 'en' ? 'migration-to-angular-22.en.md' : 'migration-to-angular-22.md';
      const response = await fetch('/docs/' + fileName);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить документацию.');
      }
      
      const markdown = await response.text();
      const rawHtml = await marked.parse(markdown);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      
      this.htmlContent.set(cleanHtml);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Произошла неизвестная ошибка');
    } finally {
      this.isLoading.set(false);
    }
  }
}

