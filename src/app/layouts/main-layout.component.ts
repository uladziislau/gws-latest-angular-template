import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500/30">
      <!-- Top Navigation (Could be extracted into widgets/header) -->
      <header class="sticky top-0 z-40 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span class="text-white font-bold font-mono text-sm">FSD</span>
            </div>
            <h1 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tracking-[-0.02em]">
              Универсальный <span class="text-zinc-500 font-medium tracking-normal">Шаблон</span>
            </h1>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="container mx-auto px-4 py-8 max-w-5xl">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {}
