import {TestBed} from '@angular/core/testing';

import {PolygloatService} from './polygloat.service';

describe('PolygloatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygloatService = TestBed.get(PolygloatService);
    expect(service).toBeTruthy();
  });
});
