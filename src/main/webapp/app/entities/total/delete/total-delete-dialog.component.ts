import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITotal } from '../total.model';
import { TotalService } from '../service/total.service';

@Component({
  templateUrl: './total-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TotalDeleteDialogComponent {
  total?: ITotal;

  protected totalService = inject(TotalService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.totalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
