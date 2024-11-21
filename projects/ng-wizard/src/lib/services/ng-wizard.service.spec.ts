import { TestBed } from '@angular/core/testing';

import { NgWizardService } from './ng-wizard.service';

describe('NgWizardService', () => {
  let service: NgWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
