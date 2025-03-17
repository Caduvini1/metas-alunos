import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { AlunoDetailComponent } from './aluno-detail.component';

describe('Aluno Management Detail Component', () => {
  let comp: AlunoDetailComponent;
  let fixture: ComponentFixture<AlunoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./aluno-detail.component').then(m => m.AlunoDetailComponent),
              resolve: { aluno: () => of({ id: 15328 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AlunoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlunoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load aluno on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AlunoDetailComponent);

      // THEN
      expect(instance.aluno()).toEqual(expect.objectContaining({ id: 15328 }));
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
