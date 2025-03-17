import { IMeta, NewMeta } from './meta.model';

export const sampleWithRequiredData: IMeta = {
  id: 17187,
  valor: 11470,
  area: 'CIENCIAS_HUMANAS',
};

export const sampleWithPartialData: IMeta = {
  id: 15622,
  valor: 24285,
  area: 'CIENCIAS_HUMANAS',
};

export const sampleWithFullData: IMeta = {
  id: 32703,
  valor: 5776,
  area: 'LINGUAGENS',
};

export const sampleWithNewData: NewMeta = {
  valor: 16271,
  area: 'MATEMATICA',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
