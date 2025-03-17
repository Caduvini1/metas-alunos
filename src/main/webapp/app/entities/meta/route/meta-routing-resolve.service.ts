import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMeta } from '../meta.model';
import { MetaService } from '../service/meta.service';

const metaResolve = (route: ActivatedRouteSnapshot): Observable<null | IMeta> => {
  const id = route.params.id;
  if (id) {
    return inject(MetaService)
      .find(id)
      .pipe(
        mergeMap((meta: HttpResponse<IMeta>) => {
          if (meta.body) {
            return of(meta.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default metaResolve;
