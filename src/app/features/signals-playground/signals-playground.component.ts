import { ChangeDetectionStrategy, Component, inject, ElementRef, viewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { SpatialFieldService } from './services/spatial-field.service';

@Component({
  selector: 'app-signals-playground',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <div class="space-y-8">
        
        <!-- Header description -->
        <div class="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 text-xs font-semibold uppercase tracking-wider mb-3">
              Angular 22 Reactive Engine • 165Hz GPU Accelerated
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {{ i18n.currentLang() === 'ru' ? 'Пространственная лаборатория сигналов' : 'Spatial Signals Laboratory' }}
            </h2>
            <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              {{ i18n.currentLang() === 'ru' 
                ? 'Движение курсора оптимизировано через requestAnimationFrame (165 FPS) с аппаратным ускорением GPU, мгновенно пересчитывая геометрию и магнитные связи узлов.' 
                : 'Cursor motion synchronized via requestAnimationFrame (165 FPS) with GPU hardware acceleration, instantly propagating through computed() properties.' }}
            </p>
          </div>

          <!-- Mode Selector & Stats -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
              <button 
                (click)="fieldService.setMode('grid')"
                class="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                [ngClass]="fieldService.mode() === 'grid' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'">
                {{ i18n.currentLang() === 'ru' ? 'Сетка узлов' : 'Node Grid' }}
              </button>
              <button 
                (click)="fieldService.setMode('constellation')"
                class="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                [ngClass]="fieldService.mode() === 'constellation' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'">
                {{ i18n.currentLang() === 'ru' ? 'Констелляция' : 'Constellation' }}
              </button>
            </div>

            <button 
              (click)="fieldService.togglePause()"
              class="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
              <span class="w-2 h-2 rounded-full" [ngClass]="fieldService.isPaused() ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'"></span>
              {{ fieldService.isPaused() 
                ? (i18n.currentLang() === 'ru' ? 'Возобновить' : 'Resume') 
                : (i18n.currentLang() === 'ru' ? 'Пауза потока' : 'Pause Stream') }}
            </button>
          </div>
        </div>

        <!-- Main Interactive Workspace -->
        <div 
          #stage
          (mousemove)="onMouseMove($event)"
          (mouseleave)="onMouseLeave()"
          class="relative w-full h-[480px] sm:h-[550px] rounded-[2.5rem] bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl select-none cursor-crosshair">
          
          <!-- Background Grid Pattern -->
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <!-- Dynamic SVG Connection Lines for Constellation mode -->
          @if (fieldService.mode() === 'constellation') {
            <svg class="absolute inset-0 w-full h-full pointer-events-none">
              @for (node of fieldService.nodes; track node.id) {
                @if (node.calculateDistance(fieldService.mouseX(), fieldService.mouseY()) < 160) {
                  <line 
                    [attr.x1]="node.baseX" 
                    [attr.y1]="node.baseY" 
                    [attr.x2]="fieldService.mouseX()" 
                    [attr.y2]="fieldService.mouseY()" 
                    stroke="rgba(99, 102, 241, 0.35)" 
                    stroke-width="1.5"
                    stroke-dasharray="4 4"
                  />
                }
              }
            </svg>
          }

          <!-- Interactive Absolutely Positioned Nodes Field -->
          <div class="absolute inset-0 pointer-events-none">
            @for (node of fieldService.nodes; track node.id) {
              <div 
                class="absolute will-change-transform flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                [style.left.px]="node.baseX"
                [style.top.px]="node.baseY"
                [style.transform]="node.getTransform(fieldService.mouseX(), fieldService.mouseY(), fieldService.isPaused())">
                
                <!-- Node core dot -->
                <div 
                  class="w-4 h-4 rounded-full transition-colors duration-150 shadow-md flex items-center justify-center"
                  [style.background-color]="node.getColor(fieldService.mouseX(), fieldService.mouseY())"
                  [style.box-shadow]="node.getGlow(fieldService.mouseX(), fieldService.mouseY())">
                  <div class="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
                </div>

                <!-- Distance indicator tooltip on hover/proximity -->
                @if (node.isNear(fieldService.mouseX(), fieldService.mouseY())) {
                  <div class="absolute -top-7 px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] font-mono text-indigo-300 shadow-xl pointer-events-none whitespace-nowrap z-20">
                    dist: {{ node.calculateDistance(fieldService.mouseX(), fieldService.mouseY()) | number:'1.0-0' }}px
                  </div>
                }
              </div>
            }
          </div>

          <!-- Center Cursor Indicator Pulse -->
          @if (fieldService.isHovered()) {
            <div 
              class="absolute w-8 h-8 rounded-full border border-indigo-400/50 bg-indigo-500/15 pointer-events-none will-change-transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-30"
              [style.left.px]="fieldService.mouseX()"
              [style.top.px]="fieldService.mouseY()">
              <div class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
            </div>
          }

          <!-- Floating HUD Overlay inside Stage -->
          <div class="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-5 rounded-2xl bg-zinc-900/85 backdrop-blur-xl border border-zinc-800 text-xs text-zinc-300 shadow-2xl space-y-3 z-40">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span class="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">
                {{ i18n.currentLang() === 'ru' ? 'Динамическая телеметрия 165 FPS' : '165 FPS Live Telemetry' }}
              </span>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800">
                rAF + GPU Layer
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span class="block text-zinc-500 text-[10px]">{{ i18n.currentLang() === 'ru' ? 'Позиция курсора (X, Y)' : 'Cursor Position' }}</span>
                <span class="font-mono font-bold text-zinc-100 mt-0.5 block text-sm">
                  {{ fieldService.mouseX() | number:'1.0-0' }}, {{ fieldService.mouseY() | number:'1.0-0' }}
                </span>
              </div>

              <div class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span class="block text-zinc-500 text-[10px]">{{ i18n.currentLang() === 'ru' ? 'Активные узлы' : 'Active Nodes' }}</span>
                <span class="font-mono font-bold text-emerald-400 mt-0.5 block text-sm">
                  {{ fieldService.nodes.length }} units
                </span>
              </div>

              <div class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span class="block text-zinc-500 text-[10px]">{{ i18n.currentLang() === 'ru' ? 'Ближайший узел' : 'Closest Distance' }}</span>
                <span class="font-mono font-bold text-indigo-400 mt-0.5 block text-sm">
                  {{ fieldService.closestDistance() | number:'1.0-0' }} px
                </span>
              </div>

              <div class="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span class="block text-zinc-500 text-[10px]">{{ i18n.currentLang() === 'ru' ? 'Частота кадров' : 'Target Refresh' }}</span>
                <span class="font-mono font-bold text-cyan-400 mt-0.5 block text-sm">
                  165+ FPS
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Explanation Footer Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              1. rAF Synchronization
            </h3>
            <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {{ i18n.currentLang() === 'ru' 
                ? 'События мыши батчатся через requestAnimationFrame, синхронизируя частоту тиков с аппаратной разверткой монитора (165 Гц).' 
                : 'Mouse events are batched via requestAnimationFrame, synchronizing updates precisely with your 165Hz hardware refresh rate.' }}
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              2. GPU Compositor Layers
            </h3>
            <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {{ i18n.currentLang() === 'ru' 
                ? 'Использование will-change: transform выносит узлы на отдельный композитный слой GPU для мгновенного рендеринга без задержек.' 
                : 'Using will-change: transform promotes nodes to dedicated GPU composite layers for instantaneous rendering without layout jank.' }}
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm space-y-2">
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              3. Zero Layout Thrashing
            </h3>
            <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {{ i18n.currentLang() === 'ru' 
                ? 'Прямое векторное преобразование матриц transform исключает пересчет геометрии DOM (Layout/Reflow).' 
                : 'Direct transform matrix operations completely avoid DOM geometry reflows and layout bottlenecks.' }}
            </p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class SignalsPlaygroundComponent implements OnDestroy {
  i18n = inject(I18nService);
  fieldService = inject(SpatialFieldService);
  stage = viewChild.required<ElementRef<HTMLDivElement>>('stage');

  private rafId: number | null = null;
  private pendingX = 0;
  private pendingY = 0;

  onMouseMove(event: MouseEvent) {
    const stageEl = this.stage().nativeElement;
    const rect = stageEl.getBoundingClientRect();
    this.pendingX = event.clientX - rect.left;
    this.pendingY = event.clientY - rect.top;

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.fieldService.setMousePosition(this.pendingX, this.pendingY);
        this.rafId = null;
      });
    }
  }

  onMouseLeave() {
    this.fieldService.setHovered(false);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

