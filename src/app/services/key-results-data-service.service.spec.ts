import { TestBed } from '@angular/core/testing';

import { KeyResultDataService } from './key-results-data-service.service';

describe('KeyResultsDataServiceService', () => {
  let service: KeyResultDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyResultDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
