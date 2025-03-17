import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAluno } from '../aluno.model';
import { AlunoService } from '../service/aluno.service';

@Component({
  templateUrl: './aluno-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AlunoDeleteDialogComponent {
  aluno?: IAluno;

  protected alunoService = inject(AlunoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.alunoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
