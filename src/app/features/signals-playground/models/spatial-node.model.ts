export class SpatialNode {
  constructor(
    public readonly id: number,
    public readonly baseX: number,
    public readonly baseY: number
  ) {}

  public calculateDistance(mouseX: number, mouseY: number): number {
    const dx = this.baseX - mouseX;
    const dy = this.baseY - mouseY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public getTransform(mouseX: number, mouseY: number, isPaused: boolean): string {
    const dist = this.calculateDistance(mouseX, mouseY);
    if (dist > 140 || isPaused) {
      return 'translate(0px, 0px) scale(1)';
    }
    const angle = Math.atan2(this.baseY - mouseY, this.baseX - mouseX);
    const force = (140 - dist) * 0.25;
    const offsetX = Math.cos(angle) * force;
    const offsetY = Math.sin(angle) * force;
    const scale = 1 + (140 - dist) / 140 * 0.6;
    return `translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px) scale(${scale.toFixed(2)})`;
  }

  public getColor(mouseX: number, mouseY: number): string {
    const dist = this.calculateDistance(mouseX, mouseY);
    if (dist < 60) return '#818cf8'; // Indigo bright
    if (dist < 120) return '#6366f1';
    return '#3f3f46'; // zinc-700
  }

  public getGlow(mouseX: number, mouseY: number): string {
    const dist = this.calculateDistance(mouseX, mouseY);
    if (dist < 80) {
      return '0 0 15px rgba(99, 102, 241, 0.7)';
    }
    return 'none';
  }

  public isNear(mouseX: number, mouseY: number): boolean {
    return this.calculateDistance(mouseX, mouseY) < 80;
  }
}
