import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'title',
    pathMatch: 'full',
  },
  {
    path: 'title',
    loadComponent: () => import('./pages/title/title.component').then(m => m.TitleComponent),
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent),
      }
    ]
  },
  // Ruta comodín para redirigir a 'title' si no se encuentra la ruta
  {
    path: '**',
    redirectTo: 'title'
  }
];

