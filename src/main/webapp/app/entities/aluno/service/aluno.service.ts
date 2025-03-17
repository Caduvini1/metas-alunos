import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAluno, NewAluno } from '../aluno.model';

export type PartialUpdateAluno = Partial<IAluno> & Pick<IAluno, 'id'>;

export type EntityResponseType = HttpResponse<IAluno>;
export type EntityArrayResponseType = HttpResponse<IAluno[]>;

@Injectable({ providedIn: 'root' })
export class AlunoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/alunos');

  create(aluno: NewAluno): Observable<EntityResponseType> {
    return this.http.post<IAluno>(this.resourceUrl, aluno, { observe: 'response' });
  }

  update(aluno: IAluno): Observable<EntityResponseType> {
    return this.http.put<IAluno>(`${this.resourceUrl}/${this.getAlunoIdentifier(aluno)}`, aluno, { observe: 'response' });
  }

  partialUpdate(aluno: PartialUpdateAluno): Observable<EntityResponseType> {
    return this.http.patch<IAluno>(`${this.resourceUrl}/${this.getAlunoIdentifier(aluno)}`, aluno, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAluno>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAluno[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAlunoIdentifier(aluno: Pick<IAluno, 'id'>): number {
    return aluno.id;
  }

  compareAluno(o1: Pick<IAluno, 'id'> | null, o2: Pick<IAluno, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlunoIdentifier(o1) === this.getAlunoIdentifier(o2) : o1 === o2;
  }

  addAlunoToCollectionIfMissing<Type extends Pick<IAluno, 'id'>>(
    alunoCollection: Type[],
    ...alunosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const alunos: Type[] = alunosToCheck.filter(isPresent);
    if (alunos.length > 0) {
      const alunoCollectionIdentifiers = alunoCollection.map(alunoItem => this.getAlunoIdentifier(alunoItem));
      const alunosToAdd = alunos.filter(alunoItem => {
        const alunoIdentifier = this.getAlunoIdentifier(alunoItem);
        if (alunoCollectionIdentifiers.includes(alunoIdentifier)) {
          return false;
        }
        alunoCollectionIdentifiers.push(alunoIdentifier);
        return true;
      });
      return [...alunosToAdd, ...alunoCollection];
    }
    return alunoCollection;
  }
}
