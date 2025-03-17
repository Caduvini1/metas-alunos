import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMeta } from '../meta.model';
import { MetaService } from '../service/meta.service';

@Component({
  templateUrl: './meta-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MetaDeleteDialogComponent {
  meta?: IMeta;

  protected metaService = inject(MetaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.metaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
