import { TestBed } from '@angular/core/testing';

import { DemoWizardService } from './demo-wizard.service';

describe('DemoWizardService', () => {
  let service: DemoWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
