import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IAluno } from '../aluno.model';

@Component({
  selector: 'jhi-aluno-detail',
  templateUrl: './aluno-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class AlunoDetailComponent {
  aluno = input<IAluno | null>(null);

  previousState(): void {
    window.history.back();
  }
}
