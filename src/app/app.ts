import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- 
      Root layout module.
      Following Feature-Sliced Design (FSD):
      - App layer: Global initialization, routing, layouts
      - The app acts as an orchestrator and entry point.
    -->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}
