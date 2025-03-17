import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MetaResolve from './route/meta-routing-resolve.service';

const metaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/meta.component').then(m => m.MetaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/meta-detail.component').then(m => m.MetaDetailComponent),
    resolve: {
      meta: MetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/meta-update.component').then(m => m.MetaUpdateComponent),
    resolve: {
      meta: MetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/meta-update.component').then(m => m.MetaUpdateComponent),
    resolve: {
      meta: MetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default metaRoute;
