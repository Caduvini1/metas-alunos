import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TotalResolve from './route/total-routing-resolve.service';

const totalRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/total.component').then(m => m.TotalComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/total-detail.component').then(m => m.TotalDetailComponent),
    resolve: {
      total: TotalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/total-update.component').then(m => m.TotalUpdateComponent),
    resolve: {
      total: TotalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/total-update.component').then(m => m.TotalUpdateComponent),
    resolve: {
      total: TotalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default totalRoute;
