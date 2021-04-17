import { TestBed } from '@angular/core/testing';

import { KeyResultsDataService } from './key-results-data-service.service';

describe('KeyResultsDataServiceService', () => {
  let service: KeyResultsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyResultsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
