import { IAluno, NewAluno } from './aluno.model';

export const sampleWithRequiredData: IAluno = {
  id: 8806,
  nome: 'boo tomorrow',
};

export const sampleWithPartialData: IAluno = {
  id: 2189,
  nome: 'insecure supposing untimely',
};

export const sampleWithFullData: IAluno = {
  id: 25732,
  nome: 'oof near likewise',
};

export const sampleWithNewData: NewAluno = {
  nome: 'energetically yet webbed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
