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
        loadComponent: () => import('./features/tests-page/tests-page.component').then(m => m.TestsPageComponent)
      },
      {
        path: 'docs',
        loadComponent: () => import('./features/docs/documentation-viewer.component').then(m => m.DocumentationViewerComponent)
      }
    ]
  }
];

