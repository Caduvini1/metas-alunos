import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TotalDetailComponent } from './total-detail.component';

describe('Total Management Detail Component', () => {
  let comp: TotalDetailComponent;
  let fixture: ComponentFixture<TotalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./total-detail.component').then(m => m.TotalDetailComponent),
              resolve: { total: () => of({ id: 15255 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TotalDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load total on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TotalDetailComponent);

      // THEN
      expect(instance.total()).toEqual(expect.objectContaining({ id: 15255 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
