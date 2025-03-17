import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IMeta } from '../meta.model';

@Component({
  selector: 'jhi-meta-detail',
  templateUrl: './meta-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class MetaDetailComponent {
  meta = input<IMeta | null>(null);

  previousState(): void {
    window.history.back();
  }
}
