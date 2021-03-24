import { TestBed } from '@angular/core/testing';

import { ObjectivesDataServiceService } from './objectives-data-service.service';

describe('ObjectivesDataServiceService', () => {
  let service: ObjectivesDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectivesDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
