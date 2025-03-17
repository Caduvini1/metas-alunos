import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../meta.test-samples';

import { MetaFormService } from './meta-form.service';

describe('Meta Form Service', () => {
  let service: MetaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaFormService);
  });

  describe('Service methods', () => {
    describe('createMetaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMetaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            area: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });

      it('passing IMeta should create a new form with FormGroup', () => {
        const formGroup = service.createMetaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            area: expect.any(Object),
            aluno: expect.any(Object),
          }),
        );
      });
    });

    describe('getMeta', () => {
      it('should return NewMeta for default Meta initial value', () => {
        const formGroup = service.createMetaFormGroup(sampleWithNewData);

        const meta = service.getMeta(formGroup) as any;

        expect(meta).toMatchObject(sampleWithNewData);
      });

      it('should return NewMeta for empty Meta initial value', () => {
        const formGroup = service.createMetaFormGroup();

        const meta = service.getMeta(formGroup) as any;

        expect(meta).toMatchObject({});
      });

      it('should return IMeta', () => {
        const formGroup = service.createMetaFormGroup(sampleWithRequiredData);

        const meta = service.getMeta(formGroup) as any;

        expect(meta).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMeta should not enable id FormControl', () => {
        const formGroup = service.createMetaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMeta should disable id FormControl', () => {
        const formGroup = service.createMetaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
