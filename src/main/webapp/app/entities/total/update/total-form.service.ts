import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITotal, NewTotal } from '../total.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITotal for edit and NewTotalFormGroupInput for create.
 */
type TotalFormGroupInput = ITotal | PartialWithRequiredKeyOf<NewTotal>;

type TotalFormDefaults = Pick<NewTotal, 'id'>;

type TotalFormGroupContent = {
  id: FormControl<ITotal['id'] | NewTotal['id']>;
  media: FormControl<ITotal['media']>;
  aluno: FormControl<ITotal['aluno']>;
};

export type TotalFormGroup = FormGroup<TotalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TotalFormService {
  createTotalFormGroup(total: TotalFormGroupInput = { id: null }): TotalFormGroup {
    const totalRawValue = {
      ...this.getFormDefaults(),
      ...total,
    };
    return new FormGroup<TotalFormGroupContent>({
      id: new FormControl(
        { value: totalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      media: new FormControl(totalRawValue.media, {
        validators: [Validators.required],
      }),
      aluno: new FormControl(totalRawValue.aluno),
    });
  }

  getTotal(form: TotalFormGroup): ITotal | NewTotal {
    return form.getRawValue() as ITotal | NewTotal;
  }

  resetForm(form: TotalFormGroup, total: TotalFormGroupInput): void {
    const totalRawValue = { ...this.getFormDefaults(), ...total };
    form.reset(
      {
        ...totalRawValue,
        id: { value: totalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TotalFormDefaults {
    return {
      id: null,
    };
  }
}
