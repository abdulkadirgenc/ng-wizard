import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgWizardStepComponent } from './ng-wizard-step.component';

describe('NgWizardStepComponent', () => {
  let component: NgWizardStepComponent;
  let fixture: ComponentFixture<NgWizardStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgWizardStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgWizardStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
