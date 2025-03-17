import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMeta, NewMeta } from '../meta.model';

export type PartialUpdateMeta = Partial<IMeta> & Pick<IMeta, 'id'>;

export type EntityResponseType = HttpResponse<IMeta>;
export type EntityArrayResponseType = HttpResponse<IMeta[]>;

@Injectable({ providedIn: 'root' })
export class MetaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/metas');

  create(meta: NewMeta): Observable<EntityResponseType> {
    return this.http.post<IMeta>(this.resourceUrl, meta, { observe: 'response' });
  }

  update(meta: IMeta): Observable<EntityResponseType> {
    return this.http.put<IMeta>(`${this.resourceUrl}/${this.getMetaIdentifier(meta)}`, meta, { observe: 'response' });
  }

  partialUpdate(meta: PartialUpdateMeta): Observable<EntityResponseType> {
    return this.http.patch<IMeta>(`${this.resourceUrl}/${this.getMetaIdentifier(meta)}`, meta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMeta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMeta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMetaIdentifier(meta: Pick<IMeta, 'id'>): number {
    return meta.id;
  }

  compareMeta(o1: Pick<IMeta, 'id'> | null, o2: Pick<IMeta, 'id'> | null): boolean {
    return o1 && o2 ? this.getMetaIdentifier(o1) === this.getMetaIdentifier(o2) : o1 === o2;
  }

  addMetaToCollectionIfMissing<Type extends Pick<IMeta, 'id'>>(
    metaCollection: Type[],
    ...metasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const metas: Type[] = metasToCheck.filter(isPresent);
    if (metas.length > 0) {
      const metaCollectionIdentifiers = metaCollection.map(metaItem => this.getMetaIdentifier(metaItem));
      const metasToAdd = metas.filter(metaItem => {
        const metaIdentifier = this.getMetaIdentifier(metaItem);
        if (metaCollectionIdentifiers.includes(metaIdentifier)) {
          return false;
        }
        metaCollectionIdentifiers.push(metaIdentifier);
        return true;
      });
      return [...metasToAdd, ...metaCollection];
    }
    return metaCollection;
  }
}
