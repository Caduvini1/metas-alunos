import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAluno } from '../aluno.model';
import { AlunoService } from '../service/aluno.service';

const alunoResolve = (route: ActivatedRouteSnapshot): Observable<null | IAluno> => {
  const id = route.params.id;
  if (id) {
    return inject(AlunoService)
      .find(id)
      .pipe(
        mergeMap((aluno: HttpResponse<IAluno>) => {
          if (aluno.body) {
            return of(aluno.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default alunoResolve;
