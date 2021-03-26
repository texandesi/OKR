import { TestBed } from '@angular/core/testing';

import { ObjectivesDataService } from './objectives-data-service.service';

describe('ObjectivesDataServiceService', () => {
  let service: ObjectivesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectivesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
