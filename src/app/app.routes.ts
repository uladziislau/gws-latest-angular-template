import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'tests',
        pathMatch: 'full'
      },
      {
        path: 'tests',
        title: 'Runtime & Diagnostics | Angular 22 Template',
        loadComponent: () => import('./features/tests-page/tests-page.component').then(m => m.TestsPageComponent)
      },
      {
        path: 'signals',
        title: 'Signals Playground | Angular 22 Template',
        loadComponent: () => import('./features/signals-playground/signals-playground.component').then(m => m.SignalsPlaygroundComponent)
      },
      {
        path: 'docs',
        title: 'Documentation | Angular 22 Template',
        loadComponent: () => import('./features/docs/documentation-viewer.component').then(m => m.DocumentationViewerComponent)
      }
    ]
  }
];

