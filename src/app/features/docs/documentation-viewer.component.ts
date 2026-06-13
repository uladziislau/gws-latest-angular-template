import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-documentation-viewer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto py-12 px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Документация
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 mt-2">
          Руководство по миграции на Angular 22
        </p>
      </div>

      <div class="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        @if (isLoading()) {
          <div class="flex items-center justify-center py-20">
            <span class="w-8 h-8 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-indigo-500 animate-spin"></span>
          </div>
        } @else if (error()) {
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            {{ error() }}
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
export class DocumentationViewerComponent implements OnInit {
  htmlContent = signal<string>('');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchMarkdown();
  }

  async fetchMarkdown() {
    try {
      this.isLoading.set(true);
      // Fetches the markdown from the docs folder we exposed as assets
      const response = await fetch('/docs/migration-to-angular-22.md');
      
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
