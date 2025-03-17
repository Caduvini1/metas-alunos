import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AlunoResolve from './route/aluno-routing-resolve.service';

const alunoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/aluno.component').then(m => m.AlunoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/aluno-detail.component').then(m => m.AlunoDetailComponent),
    resolve: {
      aluno: AlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/aluno-update.component').then(m => m.AlunoUpdateComponent),
    resolve: {
      aluno: AlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/aluno-update.component').then(m => m.AlunoUpdateComponent),
    resolve: {
      aluno: AlunoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default alunoRoute;
