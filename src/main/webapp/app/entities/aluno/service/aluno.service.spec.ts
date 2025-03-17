import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAluno } from '../aluno.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../aluno.test-samples';

import { AlunoService } from './aluno.service';

const requireRestSample: IAluno = {
  ...sampleWithRequiredData,
};

describe('Aluno Service', () => {
  let service: AlunoService;
  let httpMock: HttpTestingController;
  let expectedResult: IAluno | IAluno[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AlunoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Aluno', () => {
      const aluno = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(aluno).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Aluno', () => {
      const aluno = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(aluno).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Aluno', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Aluno', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Aluno', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAlunoToCollectionIfMissing', () => {
      it('should add a Aluno to an empty array', () => {
        const aluno: IAluno = sampleWithRequiredData;
        expectedResult = service.addAlunoToCollectionIfMissing([], aluno);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aluno);
      });

      it('should not add a Aluno to an array that contains it', () => {
        const aluno: IAluno = sampleWithRequiredData;
        const alunoCollection: IAluno[] = [
          {
            ...aluno,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAlunoToCollectionIfMissing(alunoCollection, aluno);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Aluno to an array that doesn't contain it", () => {
        const aluno: IAluno = sampleWithRequiredData;
        const alunoCollection: IAluno[] = [sampleWithPartialData];
        expectedResult = service.addAlunoToCollectionIfMissing(alunoCollection, aluno);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aluno);
      });

      it('should add only unique Aluno to an array', () => {
        const alunoArray: IAluno[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const alunoCollection: IAluno[] = [sampleWithRequiredData];
        expectedResult = service.addAlunoToCollectionIfMissing(alunoCollection, ...alunoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const aluno: IAluno = sampleWithRequiredData;
        const aluno2: IAluno = sampleWithPartialData;
        expectedResult = service.addAlunoToCollectionIfMissing([], aluno, aluno2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(aluno);
        expect(expectedResult).toContain(aluno2);
      });

      it('should accept null and undefined values', () => {
        const aluno: IAluno = sampleWithRequiredData;
        expectedResult = service.addAlunoToCollectionIfMissing([], null, aluno, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(aluno);
      });

      it('should return initial array if no Aluno is added', () => {
        const alunoCollection: IAluno[] = [sampleWithRequiredData];
        expectedResult = service.addAlunoToCollectionIfMissing(alunoCollection, undefined, null);
        expect(expectedResult).toEqual(alunoCollection);
      });
    });

    describe('compareAluno', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAluno(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 15328 };
        const entity2 = null;

        const compareResult1 = service.compareAluno(entity1, entity2);
        const compareResult2 = service.compareAluno(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 15328 };
        const entity2 = { id: 9303 };

        const compareResult1 = service.compareAluno(entity1, entity2);
        const compareResult2 = service.compareAluno(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 15328 };
        const entity2 = { id: 15328 };

        const compareResult1 = service.compareAluno(entity1, entity2);
        const compareResult2 = service.compareAluno(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
