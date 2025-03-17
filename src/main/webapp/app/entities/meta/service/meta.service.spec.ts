import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IMeta } from '../meta.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../meta.test-samples';

import { MetaService } from './meta.service';

const requireRestSample: IMeta = {
  ...sampleWithRequiredData,
};

describe('Meta Service', () => {
  let service: MetaService;
  let httpMock: HttpTestingController;
  let expectedResult: IMeta | IMeta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MetaService);
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

    it('should create a Meta', () => {
      const meta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(meta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Meta', () => {
      const meta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(meta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Meta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Meta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Meta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMetaToCollectionIfMissing', () => {
      it('should add a Meta to an empty array', () => {
        const meta: IMeta = sampleWithRequiredData;
        expectedResult = service.addMetaToCollectionIfMissing([], meta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meta);
      });

      it('should not add a Meta to an array that contains it', () => {
        const meta: IMeta = sampleWithRequiredData;
        const metaCollection: IMeta[] = [
          {
            ...meta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMetaToCollectionIfMissing(metaCollection, meta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Meta to an array that doesn't contain it", () => {
        const meta: IMeta = sampleWithRequiredData;
        const metaCollection: IMeta[] = [sampleWithPartialData];
        expectedResult = service.addMetaToCollectionIfMissing(metaCollection, meta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meta);
      });

      it('should add only unique Meta to an array', () => {
        const metaArray: IMeta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const metaCollection: IMeta[] = [sampleWithRequiredData];
        expectedResult = service.addMetaToCollectionIfMissing(metaCollection, ...metaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const meta: IMeta = sampleWithRequiredData;
        const meta2: IMeta = sampleWithPartialData;
        expectedResult = service.addMetaToCollectionIfMissing([], meta, meta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meta);
        expect(expectedResult).toContain(meta2);
      });

      it('should accept null and undefined values', () => {
        const meta: IMeta = sampleWithRequiredData;
        expectedResult = service.addMetaToCollectionIfMissing([], null, meta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meta);
      });

      it('should return initial array if no Meta is added', () => {
        const metaCollection: IMeta[] = [sampleWithRequiredData];
        expectedResult = service.addMetaToCollectionIfMissing(metaCollection, undefined, null);
        expect(expectedResult).toEqual(metaCollection);
      });
    });

    describe('compareMeta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMeta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 14440 };
        const entity2 = null;

        const compareResult1 = service.compareMeta(entity1, entity2);
        const compareResult2 = service.compareMeta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 14440 };
        const entity2 = { id: 7336 };

        const compareResult1 = service.compareMeta(entity1, entity2);
        const compareResult2 = service.compareMeta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 14440 };
        const entity2 = { id: 14440 };

        const compareResult1 = service.compareMeta(entity1, entity2);
        const compareResult2 = service.compareMeta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
