import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAluno } from 'app/entities/aluno/aluno.model';
import { AlunoService } from 'app/entities/aluno/service/aluno.service';
import { TotalService } from '../service/total.service';
import { ITotal } from '../total.model';
import { TotalFormService } from './total-form.service';

import { TotalUpdateComponent } from './total-update.component';

describe('Total Management Update Component', () => {
  let comp: TotalUpdateComponent;
  let fixture: ComponentFixture<TotalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let totalFormService: TotalFormService;
  let totalService: TotalService;
  let alunoService: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TotalUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TotalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TotalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    totalFormService = TestBed.inject(TotalFormService);
    totalService = TestBed.inject(TotalService);
    alunoService = TestBed.inject(AlunoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Aluno query and add missing value', () => {
      const total: ITotal = { id: 17724 };
      const aluno: IAluno = { id: 15328 };
      total.aluno = aluno;

      const alunoCollection: IAluno[] = [{ id: 15328 }];
      jest.spyOn(alunoService, 'query').mockReturnValue(of(new HttpResponse({ body: alunoCollection })));
      const additionalAlunos = [aluno];
      const expectedCollection: IAluno[] = [...additionalAlunos, ...alunoCollection];
      jest.spyOn(alunoService, 'addAlunoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ total });
      comp.ngOnInit();

      expect(alunoService.query).toHaveBeenCalled();
      expect(alunoService.addAlunoToCollectionIfMissing).toHaveBeenCalledWith(
        alunoCollection,
        ...additionalAlunos.map(expect.objectContaining),
      );
      expect(comp.alunosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const total: ITotal = { id: 17724 };
      const aluno: IAluno = { id: 15328 };
      total.aluno = aluno;

      activatedRoute.data = of({ total });
      comp.ngOnInit();

      expect(comp.alunosSharedCollection).toContainEqual(aluno);
      expect(comp.total).toEqual(total);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITotal>>();
      const total = { id: 15255 };
      jest.spyOn(totalFormService, 'getTotal').mockReturnValue(total);
      jest.spyOn(totalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ total });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: total }));
      saveSubject.complete();

      // THEN
      expect(totalFormService.getTotal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(totalService.update).toHaveBeenCalledWith(expect.objectContaining(total));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITotal>>();
      const total = { id: 15255 };
      jest.spyOn(totalFormService, 'getTotal').mockReturnValue({ id: null });
      jest.spyOn(totalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ total: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: total }));
      saveSubject.complete();

      // THEN
      expect(totalFormService.getTotal).toHaveBeenCalled();
      expect(totalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITotal>>();
      const total = { id: 15255 };
      jest.spyOn(totalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ total });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(totalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAluno', () => {
      it('Should forward to alunoService', () => {
        const entity = { id: 15328 };
        const entity2 = { id: 9303 };
        jest.spyOn(alunoService, 'compareAluno');
        comp.compareAluno(entity, entity2);
        expect(alunoService.compareAluno).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
