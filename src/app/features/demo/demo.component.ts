import { ChangeDetectionStrategy, Component, afterNextRender, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-demo-feature',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #container class="flex flex-col gap-10 max-w-3xl mx-auto py-12">
      <div class="space-y-4 text-center mt-8">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 mb-4 animate-item opacity-0">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span class="text-xs font-medium tracking-wide uppercase text-zinc-600 dark:text-zinc-400">Angular 22 Core</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-zinc-900 dark:text-white pb-2 animate-item opacity-0">
          Архитектура нового поколения
        </h2>
        <p class="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto animate-item opacity-0">
          Инкапсулированные модули-блоки (Features) с безонным рендерингом. 
          Копируешь папку — переносишь целый кусок бизнеса вместе с UI, стейтом и логикой.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <!-- Card 1 -->
        <div class="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300 flex flex-col gap-5 animate-item opacity-0 cursor-default">
          <div class="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:-translate-y-1 transition-transform duration-300">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Самодостаточные модули</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Дизайн по фичам. Каждый модуль выступает как мини-приложение со своими данными, интерфейсом и бизнес-задачами.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="group p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300 flex flex-col gap-5 animate-item opacity-0 cursor-default">
          <div class="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white group-hover:-translate-y-1 transition-transform duration-300">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Безонный OnPush</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Моментальный рендеринг благодаря полному отказу от Zone.js. Angular локально перерисовывает только изменённые сигналы.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DemoFeatureComponent {
  container = viewChild.required<ElementRef<HTMLElement>>('container');

  constructor() {
    afterNextRender(() => {
      const items = this.container().nativeElement.querySelectorAll('.animate-item');
      animate(
        items,
        { opacity: [0, 1], y: [20, 0] },
        {
          delay: stagger(0.1),
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }
      );
    });
  }
}
