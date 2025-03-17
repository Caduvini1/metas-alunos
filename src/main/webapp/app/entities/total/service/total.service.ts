import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITotal, NewTotal } from '../total.model';

export type PartialUpdateTotal = Partial<ITotal> & Pick<ITotal, 'id'>;

export type EntityResponseType = HttpResponse<ITotal>;
export type EntityArrayResponseType = HttpResponse<ITotal[]>;

@Injectable({ providedIn: 'root' })
export class TotalService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/totals');

  create(total: NewTotal): Observable<EntityResponseType> {
    return this.http.post<ITotal>(this.resourceUrl, total, { observe: 'response' });
  }

  update(total: ITotal): Observable<EntityResponseType> {
    return this.http.put<ITotal>(`${this.resourceUrl}/${this.getTotalIdentifier(total)}`, total, { observe: 'response' });
  }

  partialUpdate(total: PartialUpdateTotal): Observable<EntityResponseType> {
    return this.http.patch<ITotal>(`${this.resourceUrl}/${this.getTotalIdentifier(total)}`, total, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITotal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITotal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTotalIdentifier(total: Pick<ITotal, 'id'>): number {
    return total.id;
  }

  compareTotal(o1: Pick<ITotal, 'id'> | null, o2: Pick<ITotal, 'id'> | null): boolean {
    return o1 && o2 ? this.getTotalIdentifier(o1) === this.getTotalIdentifier(o2) : o1 === o2;
  }

  addTotalToCollectionIfMissing<Type extends Pick<ITotal, 'id'>>(
    totalCollection: Type[],
    ...totalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const totals: Type[] = totalsToCheck.filter(isPresent);
    if (totals.length > 0) {
      const totalCollectionIdentifiers = totalCollection.map(totalItem => this.getTotalIdentifier(totalItem));
      const totalsToAdd = totals.filter(totalItem => {
        const totalIdentifier = this.getTotalIdentifier(totalItem);
        if (totalCollectionIdentifiers.includes(totalIdentifier)) {
          return false;
        }
        totalCollectionIdentifiers.push(totalIdentifier);
        return true;
      });
      return [...totalsToAdd, ...totalCollection];
    }
    return totalCollection;
  }
}
