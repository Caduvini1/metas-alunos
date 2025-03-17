import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITotal } from '../total.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../total.test-samples';

import { TotalService } from './total.service';

const requireRestSample: ITotal = {
  ...sampleWithRequiredData,
};

describe('Total Service', () => {
  let service: TotalService;
  let httpMock: HttpTestingController;
  let expectedResult: ITotal | ITotal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TotalService);
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

    it('should create a Total', () => {
      const total = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(total).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Total', () => {
      const total = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(total).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Total', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Total', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Total', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTotalToCollectionIfMissing', () => {
      it('should add a Total to an empty array', () => {
        const total: ITotal = sampleWithRequiredData;
        expectedResult = service.addTotalToCollectionIfMissing([], total);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(total);
      });

      it('should not add a Total to an array that contains it', () => {
        const total: ITotal = sampleWithRequiredData;
        const totalCollection: ITotal[] = [
          {
            ...total,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTotalToCollectionIfMissing(totalCollection, total);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Total to an array that doesn't contain it", () => {
        const total: ITotal = sampleWithRequiredData;
        const totalCollection: ITotal[] = [sampleWithPartialData];
        expectedResult = service.addTotalToCollectionIfMissing(totalCollection, total);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(total);
      });

      it('should add only unique Total to an array', () => {
        const totalArray: ITotal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const totalCollection: ITotal[] = [sampleWithRequiredData];
        expectedResult = service.addTotalToCollectionIfMissing(totalCollection, ...totalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const total: ITotal = sampleWithRequiredData;
        const total2: ITotal = sampleWithPartialData;
        expectedResult = service.addTotalToCollectionIfMissing([], total, total2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(total);
        expect(expectedResult).toContain(total2);
      });

      it('should accept null and undefined values', () => {
        const total: ITotal = sampleWithRequiredData;
        expectedResult = service.addTotalToCollectionIfMissing([], null, total, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(total);
      });

      it('should return initial array if no Total is added', () => {
        const totalCollection: ITotal[] = [sampleWithRequiredData];
        expectedResult = service.addTotalToCollectionIfMissing(totalCollection, undefined, null);
        expect(expectedResult).toEqual(totalCollection);
      });
    });

    describe('compareTotal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTotal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 15255 };
        const entity2 = null;

        const compareResult1 = service.compareTotal(entity1, entity2);
        const compareResult2 = service.compareTotal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 15255 };
        const entity2 = { id: 17724 };

        const compareResult1 = service.compareTotal(entity1, entity2);
        const compareResult2 = service.compareTotal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 15255 };
        const entity2 = { id: 15255 };

        const compareResult1 = service.compareTotal(entity1, entity2);
        const compareResult2 = service.compareTotal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
