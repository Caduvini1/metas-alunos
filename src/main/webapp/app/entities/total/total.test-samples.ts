import { ITotal, NewTotal } from './total.model';

export const sampleWithRequiredData: ITotal = {
  id: 6200,
  media: 24475.24,
};

export const sampleWithPartialData: ITotal = {
  id: 30792,
  media: 19450.37,
};

export const sampleWithFullData: ITotal = {
  id: 28605,
  media: 17391.3,
};

export const sampleWithNewData: NewTotal = {
  media: 1181.85,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
