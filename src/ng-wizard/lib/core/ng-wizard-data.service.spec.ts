import { TestBed } from '@angular/core/testing';

import { NgWizardDataService } from './ng-wizard-data.service';

describe('NgWizardDataService', () => {
  let service: NgWizardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(NgWizardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
