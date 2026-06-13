import { ChangeDetectionStrategy, Component, VERSION, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

// Simple expect shim to run "tests" live in the browser
const expect = (actual: unknown) => ({
  toBe: (expected: unknown) => {
    if (actual !== expected) {
      throw new Error(`Expected '${expected}' but got '${actual}'`);
    }
  },
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected truthy value but got '${actual}'`);
    }
  }
});

@Component({
  selector: 'app-tests-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto py-12 px-6">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border"
             [ngClass]="testsFailed() ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'">
          <span class="w-2 h-2 rounded-full animate-pulse"
                [ngClass]="testsFailed() ? 'bg-red-500' : 'bg-green-500'"></span>
          <span class="text-xs font-medium tracking-wide uppercase">
            {{ testsFailed() ? i18n.t()('tests.systems.offline') : i18n.t()('tests.systems.operational') }}
          </span>
        </div>
        
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 border-b border-zinc-200 pb-4">
          {{ i18n.currentLang() === 'ru' ? 'Системная информация и Тесты' : 'System Information & Tests' }}
        </h1>
        
        <div class="p-8 rounded-[2rem] bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <h2 class="text-lg font-semibold text-zinc-800">
            {{ i18n.currentLang() === 'ru' ? 'Текущее окружение (Runtime)' : 'Current Environment (Runtime)' }}
          </h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm">
              <span class="block text-xs font-medium text-zinc-500 mb-1">
                {{ i18n.currentLang() === 'ru' ? 'Фреймворк' : 'Framework' }}
              </span>
              <span class="text-xl font-bold text-red-600">Angular v{{ angularVersion }}</span>
            </div>
            
            <div class="p-4 rounded-xl bg-white border border-zinc-100 shadow-sm">
              <span class="block text-xs font-medium text-zinc-500 mb-1">
                {{ i18n.currentLang() === 'ru' ? 'Детекция изменений' : 'Change Detection' }}
              </span>
              <span class="text-xl font-bold text-zinc-800">Zoneless (OnPush)</span>
            </div>
          </div>
        </div>

        <div class="p-8 rounded-[2rem] bg-[#1e1e20] border border-[#2b2b2d] shadow-[0_8px_30px_rgb(0,0,0,0.2)] mt-8 font-mono transition-all duration-500 hover:border-[#3b3b3d]">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#2b2b2d]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                   [ngClass]="!hasRun() ? 'bg-[#2b2b2d] text-zinc-400' : (testsFailed() ? 'bg-red-900/50 text-red-400' : 'bg-[#3b4b27] text-[#a1d957]')">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  @if (!hasRun() || !testsFailed()) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  }
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-white tracking-tight">{{ i18n.t()('tests.runner') }}</h2>
            </div>
            
            <div class="flex items-center gap-3">
              @if (hasRun()) {
                <span class="px-2.5 py-1 text-xs font-medium rounded-md"
                      [ngClass]="testsFailed() ? 'bg-red-900/50 text-red-400' : 'bg-[#3b4b27] text-[#a1d957]'">
                  {{ testsFailed() ? 'FAIL' : 'PASS' }}
                </span>
              }
              <button 
                (click)="runLiveTests()"
                [disabled]="isRunning()"
                class="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center gap-2">
                @if (isRunning()) {
                  <span class="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  {{ i18n.t()('tests.running') }}
                } @else {
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ i18n.t()('tests.runBtn') }}
                }
              </button>
            </div>
          </div>

          <div class="space-y-4">
            @if (!hasRun() && !isRunning()) {
              <div class="text-center py-8 text-zinc-500 text-sm">
                {{ i18n.t()('tests.clickToRun') }}
              </div>
            } @else {
              <div class="flex flex-col gap-2">
                @for (res of results(); track res.name) {
                  <div class="flex items-start gap-2 text-sm flex-col py-2 border-b border-[#2b2b2d]/50 last:border-0 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" [style.animation-delay]="$index * 150 + 'ms'">
                    <div class="flex items-center gap-3 w-full">
                      <span class="flex items-center justify-center w-5 h-5 rounded-full" [ngClass]="res.passed ? 'bg-[#3b4b27]/40 text-[#a1d957]' : 'bg-red-900/40 text-red-400'">
                        {{ res.passed ? '✓' : '✗' }}
                      </span>
                      <span class="text-white">{{ res.name }}</span>
                      <span class="text-zinc-500 text-xs ml-auto">{{ res.duration }}ms</span>
                    </div>
                    @if (res.error) {
                      <div class="pl-5 text-red-400 text-xs mt-1">Error: {{ res.error }}</div>
                    }
                  </div>
                }
              </div>

              <div class="mt-8 pt-4 border-t border-[#2b2b2d] text-sm text-zinc-400">
                <div class="flex justify-between items-center py-1">
                  <span>{{ i18n.t()('tests.tests') }}</span>
                  <div>
                    <span [ngClass]="testsFailed() ? 'text-red-400' : 'text-[#a1d957]'" class="font-medium">
                      {{ passedCount() }} {{ i18n.t()('tests.passed') }}
                    </span> 
                    ({{ results().length }})
                  </div>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span>{{ i18n.t()('tests.duration') }}</span>
                  <span class="text-zinc-300">~{{ totalDuration() }}ms</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class TestsPageComponent {
  i18n = inject(I18nService);
  angularVersion = VERSION.full;
  
  results = signal<TestResult[]>([]);
  testsFailed = signal<boolean>(false);
  passedCount = signal<number>(0);
  totalDuration = signal<number>(0);
  hasRun = signal<boolean>(false);
  isRunning = signal<boolean>(false);

  runLiveTests() {
    this.isRunning.set(true);
    this.hasRun.set(false);
    this.results.set([]);
    
    // Simulate slight delay for visual effect
    setTimeout(() => {
      const executedTests: TestResult[] = [];
      
      // Test 1: Angular Version Check
      executedTests.push(this.executeTest('it should be running on Angular 22', () => {
        expect(VERSION.major).toBe('22');
      }));

      // Test 2: Zoneless compatibility 
      executedTests.push(this.executeTest('it should not rely on ZoneJS global', () => {
        // ZoneJS sets properties on window if it's loaded, we assume it's completely uninstalled or not affecting core
        const hasZone = !!(window as { Zone?: unknown }).Zone;
        expect(hasZone).toBe(false);
      }));

      this.results.set(executedTests);
      this.testsFailed.set(executedTests.some(t => !t.passed));
      this.passedCount.set(executedTests.filter(t => t.passed).length);
      this.totalDuration.set(executedTests.reduce((acc, t) => acc + t.duration, 0));
      this.hasRun.set(true);
      this.isRunning.set(false);
    }, 500);
  }

  private executeTest(name: string, fn: () => void): TestResult {
    const start = performance.now();
    try {
      fn();
      const duration = Math.round(performance.now() - start);
      return { name, passed: true, duration: duration < 1 ? 1 : duration };
    } catch (e: unknown) {
      const duration = Math.round(performance.now() - start);
      return { name, passed: false, error: e instanceof Error ? e.message : String(e), duration: duration < 1 ? 1 : duration };
    }
  }
}


