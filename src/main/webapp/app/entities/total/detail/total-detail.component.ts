import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITotal } from '../total.model';

@Component({
  selector: 'jhi-total-detail',
  templateUrl: './total-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class TotalDetailComponent {
  total = input<ITotal | null>(null);

  previousState(): void {
    window.history.back();
  }
}
