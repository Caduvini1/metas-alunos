import { Routes } from '@angular/router';

export const errorRoute: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./error.component'),
    title: 'Página de erro!',
  },
  {
    path: 'accessdenied',
    loadComponent: () => import('./error.component'),
    data: {
      errorMessage: 'Você não tem autorização para acessar esta página.',
    },
    title: 'Página de erro!',
  },
  {
    path: '404',
    loadComponent: () => import('./error.component'),
    data: {
      errorMessage: 'A página não existe.',
    },
    title: 'Página de erro!',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
