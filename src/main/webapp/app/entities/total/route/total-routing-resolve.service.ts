import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITotal } from '../total.model';
import { TotalService } from '../service/total.service';

const totalResolve = (route: ActivatedRouteSnapshot): Observable<null | ITotal> => {
  const id = route.params.id;
  if (id) {
    return inject(TotalService)
      .find(id)
      .pipe(
        mergeMap((total: HttpResponse<ITotal>) => {
          if (total.body) {
            return of(total.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default totalResolve;
