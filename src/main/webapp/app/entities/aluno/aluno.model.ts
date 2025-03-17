export interface IAluno {
  id: number;
  nome?: string | null;
}

export type NewAluno = Omit<IAluno, 'id'> & { id: null };
