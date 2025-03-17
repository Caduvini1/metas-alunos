import { IAluno } from 'app/entities/aluno/aluno.model';

export interface ITotal {
  id: number;
  media?: number | null;
  aluno?: IAluno | null;
}

export type NewTotal = Omit<ITotal, 'id'> & { id: null };
