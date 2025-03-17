import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../aluno.test-samples';

import { AlunoFormService } from './aluno-form.service';

describe('Aluno Form Service', () => {
  let service: AlunoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunoFormService);
  });

  describe('Service methods', () => {
    describe('createAlunoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlunoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing IAluno should create a new form with FormGroup', () => {
        const formGroup = service.createAlunoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getAluno', () => {
      it('should return NewAluno for default Aluno initial value', () => {
        const formGroup = service.createAlunoFormGroup(sampleWithNewData);

        const aluno = service.getAluno(formGroup) as any;

        expect(aluno).toMatchObject(sampleWithNewData);
      });

      it('should return NewAluno for empty Aluno initial value', () => {
        const formGroup = service.createAlunoFormGroup();

        const aluno = service.getAluno(formGroup) as any;

        expect(aluno).toMatchObject({});
      });

      it('should return IAluno', () => {
        const formGroup = service.createAlunoFormGroup(sampleWithRequiredData);

        const aluno = service.getAluno(formGroup) as any;

        expect(aluno).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAluno should not enable id FormControl', () => {
        const formGroup = service.createAlunoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAluno should disable id FormControl', () => {
        const formGroup = service.createAlunoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
