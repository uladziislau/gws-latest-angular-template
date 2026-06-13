import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tests-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto py-12 px-6">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs font-medium tracking-wide uppercase">All Systems Operational</span>
        </div>
        
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 border-b border-zinc-200 pb-4">
          Системная информация и Тесты
        </h1>
        
        <div class="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm flex flex-col gap-4">
          <h2 class="text-lg font-semibold text-zinc-800">Текущее окружение (Runtime)</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm">
              <span class="block text-xs font-medium text-zinc-500 mb-1">Фреймворк</span>
              <span class="text-xl font-bold text-red-600">Angular v{{ angularVersion }}</span>
            </div>
            
            <div class="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm">
              <span class="block text-xs font-medium text-zinc-500 mb-1">Детекция изменений</span>
              <span class="text-xl font-bold text-zinc-800">Zoneless (OnPush)</span>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm mt-6">
          <h2 class="text-lg font-semibold text-zinc-800 mb-4">Статус тестирования (Vitest)</h2>
          <div class="flex items-center gap-3 text-sm font-mono bg-zinc-900 text-zinc-300 p-4 rounded-xl">
            <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span class="text-white">✓ src/app/angular-version.spec.ts</span> 
              <span class="block text-zinc-500 mt-1">expect(VERSION.major).toBe('22') // PASSED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestsPageComponent {
  angularVersion = VERSION.full;
}
