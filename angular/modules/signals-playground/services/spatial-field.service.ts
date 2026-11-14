import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { SpatialNode } from '../models/spatial-node.model';

export type PlaygroundMode = 'grid' | 'constellation';

@Injectable({
  providedIn: 'root'
})
export class SpatialFieldService implements OnDestroy {
  // Signals
  readonly mouseX = signal<number>(300);
  readonly mouseY = signal<number>(225);
  readonly isHovered = signal<boolean>(false);
  readonly isPaused = signal<boolean>(false);
  readonly mode = signal<PlaygroundMode>('grid');
  readonly reactivityCount = signal<number>(48);

  private tickInterval: ReturnType<typeof setInterval> | null = null;
  readonly nodes: SpatialNode[] = [];

  constructor() {
    // Generate 48 spatial nodes distributed across coordinate space (8 cols x 6 rows)
    for (let i = 0; i < 48; i++) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const baseX = col * 85 + 75;
      const baseY = row * 75 + 65;
      this.nodes.push(new SpatialNode(i, baseX, baseY));
    }

    // Telemetry ticker
    this.tickInterval = setInterval(() => {
      if (!this.isPaused()) {
        this.reactivityCount.set(Math.floor(45 + Math.random() * 15));
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // Computed closest distance across all nodes
  readonly closestDistance = computed(() => {
    const mx = this.mouseX();
    const my = this.mouseY();
    let minDist = Infinity;
    for (const node of this.nodes) {
      const dist = node.calculateDistance(mx, my);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    return minDist === Infinity ? 0 : minDist;
  });

  public setMousePosition(x: number, y: number): void {
    if (this.isPaused()) return;
    this.mouseX.set(x);
    this.mouseY.set(y);
    this.isHovered.set(true);
  }

  public setHovered(hovered: boolean): void {
    this.isHovered.set(hovered);
  }

  public togglePause(): void {
    this.isPaused.update(p => !p);
  }

  public setMode(newMode: PlaygroundMode): void {
    this.mode.set(newMode);
  }
}
