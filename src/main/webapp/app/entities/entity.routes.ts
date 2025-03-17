import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'aluno',
    data: { pageTitle: 'Alunos' },
    loadChildren: () => import('./aluno/aluno.routes'),
  },
  {
    path: 'meta',
    data: { pageTitle: 'Metas' },
    loadChildren: () => import('./meta/meta.routes'),
  },
  {
    path: 'total',
    data: { pageTitle: 'Totals' },
    loadChildren: () => import('./total/total.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
