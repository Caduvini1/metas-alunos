import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { AreaDoEnem } from 'app/entities/enumerations/area-do-enem.model';
import { MetaService } from '../service/meta.service';
import { IMeta } from '../meta.model';
import { MetaFormGroup, MetaFormService } from './meta-form.service';

@Component({
  selector: 'jhi-meta-update',
  templateUrl: './meta-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MetaUpdateComponent implements OnInit {
  isSaving = false;
  meta: IMeta | null = null;
  areaDoEnemValues = Object.keys(AreaDoEnem);

  alunosSharedCollection: IAluno[] = [];

  protected metaService = inject(MetaService);
  protected metaFormService = inject(MetaFormService);
  protected alunoService = inject(AlunoService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MetaFormGroup = this.metaFormService.createMetaFormGroup();

  compareAluno = (o1: IAluno | null, o2: IAluno | null): boolean => this.alunoService.compareAluno(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meta }) => {
      this.meta = meta;
      if (meta) {
        this.updateForm(meta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const meta = this.metaFormService.getMeta(this.editForm);
    if (meta.id !== null) {
      this.subscribeToSaveResponse(this.metaService.update(meta));
    } else {
      this.subscribeToSaveResponse(this.metaService.create(meta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeta>>): void {
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

  protected updateForm(meta: IMeta): void {
    this.meta = meta;
    this.metaFormService.resetForm(this.editForm, meta);

    this.alunosSharedCollection = this.alunoService.addAlunoToCollectionIfMissing<IAluno>(this.alunosSharedCollection, meta.aluno);
  }

  protected loadRelationshipsOptions(): void {
    this.alunoService
      .query()
      .pipe(map((res: HttpResponse<IAluno[]>) => res.body ?? []))
      .pipe(map((alunos: IAluno[]) => this.alunoService.addAlunoToCollectionIfMissing<IAluno>(alunos, this.meta?.aluno)))
      .subscribe((alunos: IAluno[]) => (this.alunosSharedCollection = alunos));
  }
}
