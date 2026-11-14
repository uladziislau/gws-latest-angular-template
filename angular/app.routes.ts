import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./ui/app/app.entry.page').then(m => m.AppEntryPageComponent)
      },
      {
        path: 'tests',
        title: 'Runtime & Diagnostics | Angular 22 Template',
        loadComponent: () => import('./modules/tests-page/tests-page.component').then(m => m.TestsPageComponent)
      },
      {
        path: 'signals',
        title: 'Signals Playground | Angular 22 Template',
        loadComponent: () => import('./modules/signals-playground/signals-playground.component').then(m => m.SignalsPlaygroundComponent)
      },
      {
        path: 'docs',
        title: 'Documentation | Angular 22 Template',
        loadComponent: () => import('./modules/docs/documentation-viewer.component').then(m => m.DocumentationViewerComponent)
      }
    ]
  }
];

