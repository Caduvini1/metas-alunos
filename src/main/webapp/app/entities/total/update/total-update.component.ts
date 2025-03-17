import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { ITotal } from '../total.model';
import { TotalService } from '../service/total.service';
import { TotalFormGroup, TotalFormService } from './total-form.service';

@Component({
  selector: 'jhi-total-update',
  templateUrl: './total-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TotalUpdateComponent implements OnInit {
  isSaving = false;
  total: ITotal | null = null;

  alunosSharedCollection: IAluno[] = [];

  protected totalService = inject(TotalService);
  protected totalFormService = inject(TotalFormService);
  protected alunoService = inject(AlunoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TotalFormGroup = this.totalFormService.createTotalFormGroup();

  compareAluno = (o1: IAluno | null, o2: IAluno | null): boolean => this.alunoService.compareAluno(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ total }) => {
      this.total = total;
      if (total) {
        this.updateForm(total);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const total = this.totalFormService.getTotal(this.editForm);
    if (total.id !== null) {
      this.subscribeToSaveResponse(this.totalService.update(total));
    } else {
      this.subscribeToSaveResponse(this.totalService.create(total));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITotal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(total: ITotal): void {
    this.total = total;
    this.totalFormService.resetForm(this.editForm, total);

    this.alunosSharedCollection = this.alunoService.addAlunoToCollectionIfMissing<IAluno>(this.alunosSharedCollection, total.aluno);
  }

  protected loadRelationshipsOptions(): void {
    this.alunoService
      .query()
      .pipe(map((res: HttpResponse<IAluno[]>) => res.body ?? []))
      .pipe(map((alunos: IAluno[]) => this.alunoService.addAlunoToCollectionIfMissing<IAluno>(alunos, this.total?.aluno)))
      .subscribe((alunos: IAluno[]) => (this.alunosSharedCollection = alunos));
  }
}
