import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../total.test-samples';

import { TotalFormService } from './total-form.service';

describe('Total Form Service', () => {
  let service: TotalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalFormService);
  });

  describe('Service methods', () => {
    describe('createTotalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTotalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            media: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });

      it('passing ITotal should create a new form with FormGroup', () => {
        const formGroup = service.createTotalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            media: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });
    });

    describe('getTotal', () => {
      it('should return NewTotal for default Total initial value', () => {
        const formGroup = service.createTotalFormGroup(sampleWithNewData);

        const total = service.getTotal(formGroup) as any;

        expect(total).toMatchObject(sampleWithNewData);
      });

      it('should return NewTotal for empty Total initial value', () => {
        const formGroup = service.createTotalFormGroup();

        const total = service.getTotal(formGroup) as any;

        expect(total).toMatchObject({});
      });

      it('should return ITotal', () => {
        const formGroup = service.createTotalFormGroup(sampleWithRequiredData);

        const total = service.getTotal(formGroup) as any;

        expect(total).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITotal should not enable id FormControl', () => {
        const formGroup = service.createTotalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTotal should disable id FormControl', () => {
        const formGroup = service.createTotalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
