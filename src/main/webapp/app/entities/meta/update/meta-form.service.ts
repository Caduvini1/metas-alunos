import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMeta, NewMeta } from '../meta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMeta for edit and NewMetaFormGroupInput for create.
 */
type MetaFormGroupInput = IMeta | PartialWithRequiredKeyOf<NewMeta>;

type MetaFormDefaults = Pick<NewMeta, 'id'>;

type MetaFormGroupContent = {
  id: FormControl<IMeta['id'] | NewMeta['id']>;
  valor: FormControl<IMeta['valor']>;
  area: FormControl<IMeta['area']>;
  aluno: FormControl<IMeta['aluno']>;
};

export type MetaFormGroup = FormGroup<MetaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MetaFormService {
  createMetaFormGroup(meta: MetaFormGroupInput = { id: null }): MetaFormGroup {
    const metaRawValue = {
      ...this.getFormDefaults(),
      ...meta,
    };
    return new FormGroup<MetaFormGroupContent>({
      id: new FormControl(
        { value: metaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      valor: new FormControl(metaRawValue.valor, {
        validators: [Validators.required],
      }),
      area: new FormControl(metaRawValue.area, {
        validators: [Validators.required],
      }),
      aluno: new FormControl(metaRawValue.aluno),
    });
  }

  getMeta(form: MetaFormGroup): IMeta | NewMeta {
    return form.getRawValue() as IMeta | NewMeta;
  }

  resetForm(form: MetaFormGroup, meta: MetaFormGroupInput): void {
    const metaRawValue = { ...this.getFormDefaults(), ...meta };
    form.reset(
      {
        ...metaRawValue,
        id: { value: metaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MetaFormDefaults {
    return {
      id: null,
    };
  }
}
