import { TestBed } from '@angular/core/testing';

import { OpenleafBackendService } from './openleaf-backend.service';

describe('OpenleafBackendService', () => {
  let service: OpenleafBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenleafBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
