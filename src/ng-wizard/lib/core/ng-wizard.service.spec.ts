import { TestBed } from '@angular/core/testing';

import { NgWizardService } from './ng-wizard.service';

describe('NgWizardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgWizardService = TestBed.get(NgWizardService);
    expect(service).toBeTruthy();
  });
});
